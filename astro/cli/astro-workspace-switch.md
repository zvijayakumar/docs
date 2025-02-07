---
sidebar_label: "astro workspace switch"
title: "astro workspace switch"
id: astro-workspace-switch
description: Reference documentation for astro workspace switch.
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Switch between Workspaces.

## Usage 

Run `astro workspace switch <workspace-id>` to switch between Workspaces. 

You can find a Workspace's ID by running `astro workspace list`, or by opening your Workspace and going to **Workspace Settings** > **General** in the Cloud UI. On Astro, if you don't provide a Workspace ID, the CLI prompts you to pick from a list of Workspaces that you belong to in your current Organization.

## Related commands

- [`astro workspace list`](cli/astro-workspace-list.md)