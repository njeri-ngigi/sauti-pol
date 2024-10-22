# TODOs

- [ ] Google auth
- [ ] Yahoo auth
- [ ] Facebook auth
- [ ] Apple auth
- [ ] Logging
- [ ] Verify email
- [ ] Reset password
- [ ] Tracing
- [ ] Containerize
- [ ] Set up devops pipelines

Features:

- create election
- register candidates
- register voters
- vote
- tally

Entities:

- location
  - id
  - name
  - address

- election
  - id
  - name
  - location
  <!-- - positions (list of positions in election) -->
  <!-- - polling stations -->
  <!-- - candidates -->
  <!-- - voters -->
  
- polling_station
  - election_id
  - name
  - location

  <!-- - polling_stations -->
- position
  - id
  - election_id
  - name
  - qualifications
  
- candidate (who is also a voter)
  - name
  - voter_id
  - position_id
- voter
  - name
  - user_id
  - id_number
  - has_voted
  - age
  - location
- vote
  - position_id
  - voter_id
- admin
- clerk

DEVOPS:

- add logging
- add tracing

Next steps

- do devops above
- add RBAC
  - regular user -> can register as a voter and as candidates
  - admin -> can create/update/delete institutions and elections stuff
  - clerk -> can verify candidates against requirements

<!-- TODO -->
- figure out whether we want to use remix or next.js to create a react app
