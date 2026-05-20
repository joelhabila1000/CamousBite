create extension if not exists "pgcrypto";

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  owner_name text not null,
  email text unique not null,
  phone text not null,
  campus text not null,
  category text not null,
  password_hash text not null,
  open boolean not null default true,
  emoji text,
  banner text,
  hours text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  name text not null,
  price integer not null,
  tag text,
  emoji text,
  description text,
  time text,
  cals text,
  stock integer not null default 0,
  available boolean not null default true,
  sold integer not null default 0,
  badge text,
  rating text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  eta text,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  subtotal integer not null default 0,
  discount integer not null default 0,
  delivery integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid,
  vendor_id uuid references vendors(id) on delete set null,
  name text not null,
  price integer not null,
  qty integer not null,
  emoji text,
  rest text,
  created_at timestamptz not null default now()
);

create table if not exists vendor_order_status (
  order_id uuid not null references orders(id) on delete cascade,
  vendor_id uuid not null references vendors(id) on delete cascade,
  status text not null,
  updated_at timestamptz not null default now(),
  primary key (order_id, vendor_id)
);

create index if not exists idx_products_vendor on products(vendor_id);
create index if not exists idx_order_items_vendor on order_items(vendor_id);
create index if not exists idx_vendor_order_status_vendor on vendor_order_status(vendor_id);
