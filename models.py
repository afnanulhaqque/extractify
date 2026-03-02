import uuid
from datetime import datetime
from extensions import db

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(128))
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    avatar_url = db.Column(db.String(256))
    email_verified = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(64), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspaces = db.relationship('Workspace', back_populates='owner')

class Workspace(db.Model):
    __tablename__ = 'workspaces'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(128), nullable=False)
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship('User', back_populates='workspaces')
    members = db.relationship('WorkspaceMember', back_populates='workspace')
    projects = db.relationship('Project', back_populates='workspace')

class WorkspaceMember(db.Model):
    __tablename__ = 'workspace_members'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(64), default='viewer') # owner/admin/editor/viewer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    workspace = db.relationship('Workspace', back_populates='members')
    user = db.relationship('User')

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(64), default='active')
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = db.relationship('Workspace', back_populates='projects')
    scrapers = db.relationship('Scraper', back_populates='project')

class Scraper(db.Model):
    __tablename__ = 'scrapers'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    target_url = db.Column(db.String(512), nullable=False)
    selectors_json = db.Column(db.Text)
    pagination_config = db.Column(db.Text)
    headers_config = db.Column(db.Text)
    cookies_config = db.Column(db.Text)
    proxy_enabled = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(64), default='idle')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = db.relationship('Project', back_populates='scrapers')
    runs = db.relationship('ScraperRun', back_populates='scraper')

class ScraperRun(db.Model):
    __tablename__ = 'scraper_runs'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    scraper_id = db.Column(db.String(36), db.ForeignKey('scrapers.id'), nullable=False)
    status = db.Column(db.String(64), default='running') # running/success/failed
    rows_collected = db.Column(db.Integer, default=0)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime)
    error_message = db.Column(db.Text)
    execution_time = db.Column(db.Float) # in seconds

    scraper = db.relationship('Scraper', back_populates='runs')
    scraped_data = db.relationship('ScrapedData', back_populates='run')

class ScrapedData(db.Model):
    __tablename__ = 'scraped_data'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    run_id = db.Column(db.String(36), db.ForeignKey('scraper_runs.id'), nullable=False)
    data_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    run = db.relationship('ScraperRun', back_populates='scraped_data')

class Export(db.Model):
    __tablename__ = 'exports'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'))
    run_id = db.Column(db.String(36), db.ForeignKey('scraper_runs.id'))
    file_name = db.Column(db.String(256))
    file_format = db.Column(db.String(32)) # csv/xlsx/json
    file_url = db.Column(db.String(512))
    file_size = db.Column(db.Integer) # in bytes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Automation(db.Model):
    __tablename__ = 'automations'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    scraper_id = db.Column(db.String(36), db.ForeignKey('scrapers.id'), nullable=False)
    schedule_type = db.Column(db.String(64)) # hourly/daily/cron
    cron_expression = db.Column(db.String(128))
    last_run = db.Column(db.DateTime)
    next_run = db.Column(db.DateTime)
    enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ApiKey(db.Model):
    __tablename__ = 'api_keys'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    key_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(128))
    last_used = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    revoked = db.Column(db.Boolean, default=False)

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    plan_name = db.Column(db.String(128))
    status = db.Column(db.String(64))
    stripe_customer_id = db.Column(db.String(256))
    stripe_subscription_id = db.Column(db.String(256))
    current_period_start = db.Column(db.DateTime)
    current_period_end = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    amount = db.Column(db.Float)
    currency = db.Column(db.String(3))
    status = db.Column(db.String(64))
    invoice_url = db.Column(db.String(512))
    paid_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UsageLog(db.Model):
    __tablename__ = 'usage_logs'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    metric = db.Column(db.String(64)) # rows_scraped/api_calls/exports
    value = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(256))
    message = db.Column(db.Text)
    type = db.Column(db.String(64))
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(256))
    metadata_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
