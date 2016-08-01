# Cors Interface Replacement System
Welcome to the repository of the Cors Interface Replacement System. This
codebase runs on Ruby on Rails.

## Running on Local Machine
### First Time Setup
1. Install Rails
  - https://gorails.com/setup/ubuntu/16.04
  - For database, install postgreSQL
2. Run `bundle install`
3. Run `rake db:create`
4. Run `rake db:migrate`
5. Login to Rails' console with `rails console`, and type the following:
```
user = User.create(matricNo: "admin", password: "your_password_here", admin: true)
```

### Starting the Server
On your terminal, type `rails server`
