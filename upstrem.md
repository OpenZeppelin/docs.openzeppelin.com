# 跟踪上游原始文档

raw分支用于跟踪上游原始文档，定期更新

- url: https://github.com/OpenZeppelin/openzeppelin-contracts
  branches: docs-v*
  start_path: docs
  commit: f5a3590b2e17d7ff872e21d7924ba8fe4c6c2324
  date: Wed Jul 1 17:37:25 2020 -0300
  branch: docs-v3.x


- url: https://github.com/OpenZeppelin/openzeppelin-sdk
  branches: docs-v*
  start_path: packages/cli/docs
  commit: ad570c8aea7705838cf0c02e84a8deb3ed1401f8
  date: Tue Jul 7 19:09:08 2020 -0300q
  branch: docs-v2.8
  bash: cp -r packages/lib/docs ../../docs.openzeppelin.com/components/openzeppelin-sdk


- url: https://github.com/OpenZeppelin/starter-kit
  branches: master # Starter Kit is unversioned
  start_path: docs 
  branch: master
  commit: 06f0bcd0064207daca9d3840cec65ff542cb5202
  date: Wed Apr 22 18:57:02 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/starter-kit

- url: https://github.com/OpenZeppelin/openzeppelin-test-environment
  branches: docs-v*
  start_path: docs
  commit: 8273816c52bc34e7c1d469570bbe8b2a393162cd
  Date:   Fri May 22 08:41:59 2020 +1000
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-test-environment

- url: https://github.com/OpenZeppelin/openzeppelin-test-helpers
  branches: docs-v*
  start_path: docs
  branch: docs-v0.5
  commit: 64fc8732a1e3a0b9230246a8a4a2fd0a282fa22e
  Date:   Mon Jun 1 20:11:03 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-test-helpers


- url: https://github.com/OpenZeppelin/openzeppelin-gsn-provider
  branches: docs-v*
  start_path: docs
  branch: docs-v0.1
  commit: 74576d6926671c5640c22f660a8160687530706c
  Date: Tue Jan 14 00:49:30 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-gsn-provider


- url: https://github.com/OpenZeppelin/openzeppelin-gsn-helpers
  branches: docs-v*
  start_path: docs
  branch: docs-v0.2
  commit: b0313ff102c0e8d64ecce1458f0d47d0b285ff63
  Date: Mon Jan 13 13:06:44 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-gsn-helpers

- url: https://github.com/OpenZeppelin/openzeppelin-network.js
  branches: docs-v*
  start_path: docs
  branch: docs-v0.2
  commit: 8716c2f015eda069a98d7d5ea0a093ce97e09ab6
  Date:   Mon Jan 13 13:16:19 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-network.js

- url: https://github.com/OpenZeppelin/openzeppelin-contract-loader
  branches: docs-v*
  start_path: docs
  branches: docs-v0.6
  commit: cc8dd9a7037eebbbda666cc76ac22842c47c8c32
  Date:   Thu May 7 15:50:44 2020 -0300
  bash: cp -r docs ../../docs.openzeppelin.com/components/openzeppelin-contract-loader