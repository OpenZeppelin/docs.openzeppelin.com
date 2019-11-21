[Deployment logs](https://app.netlify.com/sites/openzeppelin-docs/deploys)

### Adding a new repo

Edit the [`playbook.yml`](playbook.yml) file by adding the new repository under
"sources", with the branch or branches that should be deployed, and the path
where the `antora.yml` file is found.

For the site to rebuild when there is an update, you need to add a webhook in
the repo. In the Netlify panel, go to Site Settings > Build & deploy > Build
hooks, and copy the hook URL. In the repo that is being added, go to Settings >
Webhooks, and add a webhook using this URL and the default settings.
