/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

module.exports = {
  cloud: [
    {
      type: 'doc',
      label: 'Overview',
      id: 'overview'
    },
    {
      type: 'category',
      label: 'Get Started',
      items: [
        'install-cli',
        'create-project',
      ],
    },
    {
      type: 'category',
      label: 'Develop',
      items: [
        'develop-project',
        {
          type: 'category',
          label: 'Write DAGs',
          items: [
            'deferrable-operators',
            'kubernetespodoperator',
          ],
        },
        'upgrade-runtime',
        'airflow-api',
        'test-and-troubleshoot-locally',
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      items: [
        'deploy-code',
        'ci-cd',
      ],
    },
    {
      type: 'category',
      label: 'Manage Deployments',
      items: [
        'configure-deployment',
        'api-keys',
        'environment-variables',
        'secrets-backend',
      ],
    },
    {
      type: 'category',
      label: 'Observability',
      items: [
        'deployment-metrics',
        'data-lineage',
        'scheduler-logs',
        'airflow-alerts',
      ],
    },
    {
      type: 'category',
      label: 'Administration',
      items: [
        {
          type: 'category',
          label: 'Install Astro',
          items: [
            'install-aws',
            'install-gcp',
          ],
        },
        'manage-workspaces',
        'set-up-data-lineage',
        {
          type: 'category',
          label: 'User Access',
          items: [
            'add-user',
            'user-permissions',
            'configure-idp',
          ],
        },
        {
          type: 'category',
          label: 'Manage Clusters',
          items: [
            'create-cluster',
            'modify-cluster',
            'connect-external-services',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Release Notes',
      items: [
        'release-notes',
        'cli-release-notes',
        'runtime-release-notes',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'known-limitations',
        'runtime-version-lifecycle-policy',
        {
          type: 'category',
          label: 'Cloud Configuration Reference',
          items: [
            'resource-reference-aws',
            'resource-reference-gcp',
          ],
        },
        'platform-variables',
        'data-plane-activation',
        {
          type: 'category',
          label: 'Data Lineage',
          items: [
            'data-lineage-support-and-compatibility',
            'data-lineage-concepts',],
        },
        {
          type: 'category',
          label: 'Security',
          link: { type: 'doc', id: 'security' },
          items: [
            'shared-responsibility-model',
            'resilience',
            'disaster-recovery',
            'data-protection',
            'secrets-management',],
        },
      ],
    },
  ],
};
