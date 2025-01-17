### Setup dev env

#### Install venv and flask

```bash
python -m venv venv
```
#### Activate env

Wind
```bash
.\venv\Scripts\activate
```
Linux or Max
```bash (linux or mac)
source venv/bin/activate
```

#### Install req

```bash
pip install -r requirements.txt
```

#### Start server

```bash
gunicorn -w 4 -b 0.0.0.0:5000 src.app:app
```

### Docker
```bash
docker build -t my-flask-app .
docker run -p 5000:5000 my-flask-app
```

### Database schema
![alt text](database_schema.png)