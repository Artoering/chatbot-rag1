import os
import json
from typing import Dict, Any

TENANTS_DIR = os.path.join(os.path.dirname(__file__), '../tenants')

def load_tenant_config(tenant_id: str) -> Dict[str, Any]:
    """Load tenant config from JSON file by tenant_id."""
    config_path = os.path.join(TENANTS_DIR, f'{tenant_id}.json')
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Tenant config for '{tenant_id}' not found.")
    with open(config_path, 'r') as f:
        return json.load(f)
