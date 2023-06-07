---
title: "Create an ELT pipeline with Airflow, dbt Core, Cosmos and the Astro Python SDK"
description: "Use Airflow, dbt Core, Cosmos and the Astro Python SDK in an ELT pipeline to analyze energy data."
id: use-case-airflow-dbt
sidebar_label: "Airflow and dbt Core"
sidebar_custom_props: { icon: 'img/integrations/dbt.png' }
---

import CodeBlock from '@theme/CodeBlock';
import cosmos_energy_dag from '!!raw-loader!../code-samples/dags/use-case-airflow-dbt/cosmos_energy_dag.py';

[dbt Core](https://docs.getdbt.com/) is a popular open-source library for analytics engineering that helps users build interdependent SQL models. Thanks to the [Cosmos](https://astronomer.github.io/astronomer-cosmos/) provider package, you can integrate any dbt project into your DAG with only a few lines of code. This example combines transformation steps in dbt Core integrated via Cosmos with ELT tasks defined using the [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html) to create a pipeline that analyzes energy data.

:::info

The full Astro project used in this example can be cloned from [this repository](https://github.com/astronomer/astro-dbt-provider-tutorial-example). 

:::

## Before you start

To use this example you should have an understanding of:

- The basics of dbt Core. See [What is dbt?](https://docs.getdbt.com/docs/introduction).
- Airflow fundamentals, such as writing DAGs and defining tasks. See [Get started with Apache Airflow](get-started-with-airflow.md).
- The Astro Python SDK. See [Write a DAG with the Astro Python SDK](astro-python-sdk.md).
- Airflow task groups. See [Airflow task groups](task-groups.md).
- Airflow connections. See [Manage connections in Apache Airflow](connections.md).

You will need:

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview) and an Astro project created by running `astro dev start`.
- Access to a data warehouse supported by dbt Core and the Astro Python SDK. See [dbt documentation](https://docs.getdbt.com/docs/supported-data-platforms) for all supported warehouses of dbt Core and the [Astro Python SDK documentation](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html) for all supported warehouses of the Astro Python SDK. This example uses a local [PostgreSQL](https://www.postgresql.org/) database with a database called `energy_db` and a schema called `energy_schema`.

## Configure your Astro project

In order to use Cosmos you need to install the dbt adapter for your data warehouse in a virtual environment in your Airflow instance. 

Add the following to your Dockerfile:

```Dockerfile
# install dbt into a virtual environment
# replace dbt-postgres with another supported adapter if you're using a different warehouse type
RUN python -m venv dbt_venv && source dbt_venv/bin/activate && \
pip install --no-cache-dir dbt-postgres && deactivate
```

Add the Cosmos and Astro Python SDK packages to the requirements.txt file in your project:

```text
astronomer-cosmos==0.7.0
astro-sdk-python==1.6.1
```

Set the following environment variable to enable deserialization of Astro Python SDK objects:

```text
AIRFLOW__CORE__ALLOWED_DESERIALIZATION_CLASSES = airflow\.* astro\.*
```

## Connect Airflow to your database

This example runs ELT operations in a data warehouse. Set a connection to your data warehouse either in the Airflow UI or as an environment variable. See [Manage connections in Apache Airflow](connections.md) for more information. Both dbt Core via Cosmos and the Astro Python SDK will be able to use the same connection.

For a connection to a PostgreSQL database, define the following parameters:

- **Connection ID**: `db_conn`.
- **Connection Type**: `Postgres`.
- **Host**: Your Postgres host address.
- **Schema**: Your Postgres database (`energy_db`). 
- **Login**: Your Postgres login username.
- **Password**: Your Postgres password.
- **Port**: Your Postgres port.

## Get the data

This tutorial uses an Airflow DAG to orchestrate dbt Core jobs that calculate the percentage of solar and renewable energy capacity in different years for a selected country.

1. [Download the CSV file](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv) from GitHub.
2. Save the downloaded CSV file in the `include` directory of your Astro project.

This tutorial uses a subset of the original data. The full data source provided by Open Power System Data can be found [here](https://doi.org/10.25832/national_generation_capacity/2020-10-01).

## Prepare your dbt Core models

When using dbt Core with Airflow by leveraging Cosmos you need to add your dbt project in a `dbt` directory within your Astro projects `dags` folder.

Create a dbt project called `my_energy_project` with the following information in `dbt_project.yml`:

```yml
name: 'my_energy_project'
# while you need to name a profile, you do not need to have a profiles.yml file defined when using Cosmos
profile: my_profile
models:
  my_energy_project:
    materialized: table
# create a variable called country_code and give it the default value "FR" (for France)
vars:
  country_code: "FR"
```

Add these two models to your dbt Core project:

`select_country.sql`:

```sql
select 
    "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY"
from energy_db.energy_schema.energy
where "COUNTRY" = '{{ var("country_code") }}'
```

`create_pct.sql`:

```sql
select 
    "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY",
    "SOLAR_CAPACITY" / "TOTAL_CAPACITY" AS "SOLAR_PCT",
    "RENEWABLES_CAPACITY" / "TOTAL_CAPACITY" AS "RENEWABLES_PCT"
from {{ ref('select_country') }}
where "TOTAL_CAPACITY" is not NULL
```

:::info

If you are using a different data warehouse than Postgres you will need to adapt the `FROM` statement in the first model and potentially the SQL dialect in both dbt models.

:::

After adding all files you should have this structure in your Astro project.

```text
.
└── dags
│   └── dbt
│       └── my_energy_project
│          ├── dbt_project.yml
│          └── models
│              ├── select_country.sql
│              └── create_pct.sql
└── include
    └── subset_energy_capacity.csv
```

## Create a DAG

Add the following Airflow DAG to your Astro project:

<CodeBlock language="python">{cosmos_energy_dag}</CodeBlock>

This DAG consists of two tasks and one task group:

- The `load_file` task uses the [Astro Python SDK `load file` operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/load_file.html) to load the contents of the local CSV file into the data warehouse.
- The `transform_data` task group is created from the dbt models. The task group will contain two nested task groups with two tasks each, one for `dbt run`, the other for `dbt test`.
- The `log_data_analysis` task uses the [Astro Python SDK dataframe operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html) to run an analysis on the final table using `pandas` and logs the results.

The `DbtTaskGroup` function of the Astro dbt provider package automatically scans the `dbt` folder for dbt projects and creates a task group (`transform_data` in this example) containing Airflow tasks for running and testing your dbt models. Additionally, the provider can infer dependencies within the dbt project and will set your Airflow task dependencies accordingly.

You can choose which country's data to analyze by specifying your desired `country_code` in the `dbt_args` parameter of the DbtTaskGroup. See the [dataset](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv) for all available country codes.

## Result

Open the logs of the `log_data_analysis` task to see the proportional solar and renewable energy capacity development in the country you selected.

![Energy Analysis logs](/img/guides/cosmos_energy_analysis_logs.png)

## Learn more

- Tutorial: [Orchestrate dbt Core jobs with Airflow and Cosmos](airflow-dbt.md).
- Webinar: [The easiest way to orchestrate your dbt workflows from Airflow](https://www.astronomer.io/events/webinars/the-easiest-way-to-orchestrate-your-dbt-workflows-from-airflow/).
- Tutorial: [Orchestrate dbt Cloud jobs with Airflow](airflow-dbt-cloud.md).
- Documentation: [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html).
- Documentation: [Astronomer Cosmos](https://astronomer.github.io/astronomer-cosmos/).