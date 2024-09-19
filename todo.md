# TODOs

- [ ] Google auth
- [ ] Yahoo auth
- [ ] Facebook auth
- [ ] Apple auth
- [ ] RBAC
  - Create roles
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
  - 
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
