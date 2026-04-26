from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

db_url = settings.effective_database_url
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# `prepare_threshold=None` disables psycopg3's automatic server-side prepared
# statements. They are incompatible with Supabase's Supavisor pooler (and any
# PgBouncer-style transaction pooler): the pooler rotates which physical
# Postgres connection serves each query, so a `_pg3_N` statement prepared on
# one backend connection is missing when the next query lands on a different
# one — surfacing as `psycopg.errors.InvalidSqlStatementName: prepared
# statement "_pg3_N" does not exist` and a 500 to the client. App Review
# caught this on /auth/verify-otp (submission fe194338-…); leaving it on
# would 500 any DB-touching endpoint at random under pooled connections.
engine = create_engine(
    db_url,
    pool_pre_ping=True,
    connect_args={"prepare_threshold": None},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
