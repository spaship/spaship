---
id: november-updates
title: November Updates
author: Nilesh Patil
author_title: SPAship Core Team
author_url: https://github.com/npatil9
author_image_url: https://www.gravatar.com/avatar/4211b641d792a4fa4f79890d7c72daf9
tags: [monthly updates, spaship]
---

## Key Highlights

- [Jared Sprague](https://github.com/Jared-Sprague) visited India in the week of 4th Nov.
  - Brainstorming on various topics
  - Communication/Sync among team
  - Feature prioritization
- Architecture deep dive
  - Edge cache demo - Akamai
    - How old is your cache ? How do we control caching using .htaccess?
    - MaxAge directive & Cache Status
    - Recommend users (a note) - A good time to purge the cache.
    - Replace the Clear Cache with Cache-Control/Management component.
    - Collect Cache-control configurations in SPAship.yml file
  - Path Proxy
    - Security loophole - Users can deploy SPA into other user's SPA directories.
    - Tokenization - Slashes are converted by underscores.
    - Every SPA gets its own directory.
- SPAship maintenance
  - SPA deletions/cleaning - how do we restore data?
  - Directory structure issues.
  - Questions
    - What if the root directory gets deleted.
    - Disaster recovery management - backing up SPAship / Mirror. Created a separate milestone for DR & Backup.
- Presentation to Cert & GSS Engineering team
  - Authorization to deploy to specific Paths
  - The deployment key can be easily found in the repo so recommended choosing better auth mechanism.
  - What if we introduce two-factor authentication to secure the deployment.?
  - What if users hijacking the path?
  - Warn users with a message. Redirect to the route owners.
    - Route owners - visible in the SPA list.
- Brainstorming
  - How to prioritize features
  - SPAship MVP
- Added a new milestone
  - Milestone - Disaster Recovery / Backing up SPAship.
    - Goal: Recovering the SPAship platform in the fastest time.
- MVP feature set
  - Created MVP [issues](https://github.com/spaship/spaship/issues) & [milestones](https://github.com/spaship/spaship/milestones)
- Created feature priority metrics for better decision making.
  - This document will not be a decision-maker. It will help to validate the priorities based on multiple parameters
- [Wei Tan](https://github.com/tanyutu) joined the team as QA.
  - My name is Wei Tan, I have been in Red Hat for more than 3 years. I'm the QE from CP-labs team and located in Beijing, China."

## Next Steps

- MVP development
  - [MVP] Code hardening, testing and documentation
  - [MVP] SPA Manager - SPA List
    - Continue brainstorming and add more to UI based on user feedback.
  - [MVP] Security, Authentication and Authorization
  - [MVP] Reference implementation running on Managed Platform
- Disaster Recovery / Backing up SPAship. / Mirror
- Brainstorming on remaining milestones
- Infrastructure readiness.
- Feature prioritization
- Define and document the SPAship scope.
- Continue the discussion with EA/InfoSec.
