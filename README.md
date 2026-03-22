# AI Learning Companion - Module 1 Retention Engine

This project contains a production-ready Django backend module for spaced repetition using SM-2.

## 1. Setup Commands (Windows PowerShell)

```powershell
cd "a:\Spaced repetiton statement 1 backend\learning_companion"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 2. App Included

- Django app name: `retention_engine`
- API base: `/api/`

## 3. API Endpoints

- `POST /api/revisions/log/` -> Domino Effect + SM-2 review update
- `POST /api/revisions/generate-mcq/` -> Returns structured LLM prompt payload for MCQ generation
- `GET /api/revisions/dashboard/` -> Returns concept dashboard with dynamic color codes
- `POST /api/demo/simulate-day/` -> Subtracts exactly one day from all `StudentMastery.next_review_date`

## 4. Example Payloads

### POST /api/revisions/log/
```json
{
  "concept_id": 1,
  "quality_score": 2
}
```

### POST /api/revisions/generate-mcq/
```json
{
  "concept_id": 1
}
```

### POST /api/demo/simulate-day/
```json
{}
```

## 5. Notes

- Authentication is required for API endpoints.
- Default auth is SessionAuthentication + BasicAuthentication for quick hackathon integration.
- CORS is open (`CORS_ALLOW_ALL_ORIGINS = True`) for rapid frontend connection during demo.
