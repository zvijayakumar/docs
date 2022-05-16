module.exports = {
  cli: [
      {
        type: 'doc',
        label: 'CLI Overview',
        id: 'overview'
      },
      {
        type: 'doc',
        label: 'Quickstart',
        id: 'cli-quickstart'
      },
      {
      type: 'category',
      label: 'CLI Command Reference',
      items: [
        'cli-reference/astrocloud-auth-login',
        'cli-reference/astrocloud-auth-logout',
        'cli-reference/astrocloud-completion',
        'cli-reference/astrocloud-deploy',
        'cli-reference/astrocloud-deployment-create',
        'cli-reference/astrocloud-deployment-delete',
        'cli-reference/astrocloud-deployment-list',
        'cli-reference/astrocloud-deployment-logs',
        'cli-reference/astrocloud-deployment-update',
        'cli-reference/astrocloud-deployment-variable-create',
        'cli-reference/astrocloud-deployment-variable-list',
        'cli-reference/astrocloud-dev-init',
        'cli-reference/astrocloud-dev-kill',
        'cli-reference/astrocloud-dev-logs',
        'cli-reference/astrocloud-dev-parse',
        'cli-reference/astrocloud-dev-ps',
        'cli-reference/astrocloud-dev-pytest',
        'cli-reference/astrocloud-dev-run',
        'cli-reference/astrocloud-dev-start',
        'cli-reference/astrocloud-dev-stop',
        'cli-reference/astrocloud-dev-restart',
        'cli-reference/astrocloud-version',
        'cli-reference/astrocloud-workspace-list',
        'cli-reference/astrocloud-workspace-switch',],
    },
    {
      type: 'doc',
      label: 'Release Notes',
      id: 'cli-release-notes'
    },
  ],
};
