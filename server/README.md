# server

A server that for now manages everything.

## Development

### Migrations

**Important**: if required to work with migrations manually, you must do so inside the docker container where proper environment variables are set. Otherwise you'll run into issues to connect to the database.

As long as the project is in its POC state we want to continuously allow ourselves to edit the initial migration file and not create many of them.
We will start proper versioning once the first public release airs.

To regenerate the initial migration file, run the following command.
(If destructive schema operations were introduced, prisma will ask to wipe the schema and you will thus loose data)

```
npm run poc:regenerate-migrations
```
