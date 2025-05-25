## To Setup Database
1. Create a database in PSQL
2. Copy and update fields from `.env.example` into `.env` with your database connection information 
3. Run migrations to get the latest schema `poetry run python manage.py migrate`

## To Run Server
1. [Optional] Ensure poetry is installed: `curl -sSL https://install.python-poetry.org | python3 -`
2. Install dependencies: `poetry install`
3. Run server: `poetry run python manage.py runserver`
