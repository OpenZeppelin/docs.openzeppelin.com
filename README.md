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

### Post-processing

Generally, each repository under the `sources` field in the `playbook.yml` file
will use `HEAD` as the default branch. However, if the repository requires to
execute a post-processing step, a specific branch can be specified.

This site will pull in the latest version of the `branches` field from the
`playbook.yml` source repository (i.e. `content.sources[*].branches`). This
can be used to point to a post-processed branch.

An example of a CI Github Action that post-processes the `master` branch and
pushes the result to the `docs-v*` branch can be found in the OpenZeppelin
Contracts [docs workflow](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/.github/workflows/docs.yml).
This workflow creates an automated API reference for the Contracts library.
