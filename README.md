[Deployment logs](https://app.netlify.com/sites/openzeppelin-docs/deploys)

### Adding a new repo

Edit the [`playbook.yml`](playbook.yml) file by adding the new repository under
"sources", with the branch or branches that should be deployed, and the path
where the `antora.yml` file is found.

For the site to rebuild when there is an update, you need to add a webhook in
the repo. In the Netlify panel, go to Site Settings > Build & deploy > Build
hooks, and copy the hook URL. In the repo that is being added, go to Settings >
Webhooks, and add a webhook using this URL and the default settings.

To show it in the sidebar, add the `name` from the repo's `antora.yml` in
[`navigation.hbs`](./ui/theme/partials/navigation.hbs#L17-L25), and add an svg icon
inside the [`icons folder`](./ui/theme/images/icons) matching the name.

Finally, add an entry for it inside the [`model.yml`](./ui/preview/model.yml) file, for UI development purposes.
