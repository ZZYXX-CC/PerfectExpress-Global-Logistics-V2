# PerfectExpress Admin Onboarding Guide

**Version 1.0** | Last Updated: February 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Accessing the Admin Console](#accessing-the-admin-console)
3. [Command Center Dashboard](#command-center-dashboard)
4. [Shipment Lifecycle: Complete Flow](#shipment-lifecycle-complete-flow)
5. [User Management](#user-management)
6. [Support & Communication Center](#support--communication-center)
7. [Mobile Management](#mobile-management)

---

## System Overview

PerfectExpress is a premium logistics management platform designed for tracking and managing courier shipments globally. As an administrator, you have full access to:

- **Shipment Management** — Create, update, track, and close shipments
- **User Management** — Manage client and staff accounts, assign roles
- **Support Center** — Handle customer inquiries and support tickets
- **Analytics** — View revenue, active shipments, and operational metrics

**Tech Stack:** React + Vite frontend, Supabase backend, Leaflet maps, Resend email notifications

---

## Accessing the Admin Console

### Login Process
1. Navigate to `https://perfectexpress-courier.vercel.app/login`
2. Enter your admin credentials (email + password)
3. Click **Secure Login**
4. You will be redirected to the **Command Center** dashboard

> **Note:** Admin accounts are distinguished by the `role: Admin` field in your profile. If you see a client dashboard instead, contact a system administrator to update your role.

---

## Command Center Dashboard

Upon login, you'll see the **Command Center** — your operational headquarters.

### Key Metrics Display
| Metric | Description |
|--------|-------------|
| **Total Active** | Number of shipments currently in transit |
| **Revenue** | Total value of all quoted/paid shipments |

### Navigation Tabs
The dashboard has four primary tabs:

| Tab | Purpose |
|-----|---------|
| **Analytics** | Revenue charts, shipment volume trends |
| **Shipments** | Full list of all shipments with quick actions |
| **Users** | Client and staff account management |
| **Support** | Customer inquiries and ticket management |

---

## Shipment Lifecycle: Complete Flow

This section covers the entire journey of a shipment from creation to delivery.

### Step 1: Creating a New Shipment

**Navigation:** Dashboard → Shipments Tab → Click `+ New Shipment`

**Required Information:**

**Sender Information:**
- Full Name (required)
- Email Address
- Street Address (required) — *Include city name for auto-location*

**Receiver Information:**
- Full Name (required)
- Email Address
- Street Address (required)

**Parcel Details:**
- Description (e.g., "Electronics", "Documents")
- Weight (kg)
- Service Type:
  - `Standard Freight` — Economy shipping
  - `Express Air` — Priority delivery
  - `Secure / Luxury` — High-value items with enhanced handling

**Administrative Details:**
- Quoted Price ($) — Optional, set when providing quote to customer
- Created Date — Defaults to now, can backdate if needed

**What Happens on Creation:**
1. System generates a unique tracking number (format: `PFX-########`)
2. Initial location is auto-extracted from sender address (e.g., "Lagos" → "Lagos Logistics Center")
3. Status is set to `pending`
4. First history entry is logged: *"Shipment created and processing at origin facility."*
5. Customer receives notification if notifications are enabled

---

### Step 2: Understanding Shipment Statuses

Shipments progress through the following statuses:

| Status | Description | Typical Action |
|--------|-------------|----------------|
| `pending` | Order created, awaiting processing | Review shipment details |
| `quoted` | Price has been quoted to customer | Wait for customer payment |
| `confirmed` | Payment received and verified | Prepare for dispatch |
| `dispatched` | Left origin facility | Update location to transit hub |
| `in-transit` | Moving between locations | Update location as it moves |
| `arrived_hub` | At regional distribution hub | Process for local delivery |
| `out-for-delivery` | With local courier for final delivery | Mark delivered when complete |
| `delivered` | Successfully delivered to recipient | Close shipment |

**Special Statuses:**
- `held` — Shipment detained (customs, payment issue, etc.)
- `cancelled` — Order cancelled by customer or admin

---

### Step 3: Updating Shipment Status & Location

**Navigation:** Dashboard → Shipments Tab → Click `Update Location` on any shipment row

**Status Updater Modal Features:**

**Quick Actions (One-Click Buttons):**
- **Quick Dispatch** — Sets status to `dispatched`, location to sender's city + "Logistics Center"
- **Out for Delivery** — Sets status to `out-for-delivery`, location to receiver's city + "Delivery Hub"

**Manual Fields:**
| Field | Purpose |
|-------|---------|
| **Status** | Dropdown with all status options |
| **Current Location** | Free-text for city/facility (e.g., "Berlin Distribution Hub") |
| **Payment Status** | Toggle between `Paid` / `Unpaid` |

**How to Update:**
1. Click `Update Location` on the shipment row
2. Use a Quick Action OR manually select status and enter location
3. Click `Update Status`
4. System logs the change in shipment history with timestamp
5. Customer receives notification of the update

---

### Step 4: Setting Map Coordinates for Live Tracking

The tracking page displays a live map showing the shipment's current location. Coordinates can be set two ways:

**Method 1: Manual Entry**
- Enter **Latitude** (e.g., `51.505`)
- Enter **Longitude** (e.g., `-0.09`)

**Method 2: Google Maps Link (Recommended)**
1. Open Google Maps and find the location
2. Copy the URL from your browser
3. Paste into the **Google Maps Link** field
4. System auto-extracts coordinates from URL patterns:
   - `@lat,lng` format: `...@51.505,-0.09,15z`
   - `?q=lat,lng` format: `...?q=51.505,-0.09`

> **Important:** If no coordinates are set, the map defaults to London. Always set coordinates for accurate customer tracking display.

---

### Step 5: Editing Full Shipment Details

**Navigation:** Dashboard → Shipments Tab → Click the **pencil icon** on any shipment row

The **Shipment Editor** allows modification of:
- Sender name, email, address
- Receiver name, email, address
- Parcel description, weight, service type
- Quoted price
- Created date

> **Note:** For status and location changes, use the **Update Location** button instead for proper history logging.

---

### Step 6: Marking a Shipment as Delivered

**Final Steps:**
1. Click `Update Location` on the shipment
2. Set **Status** to `Delivered`
3. Set **Current Location** to delivery address or "Delivered to Recipient"
4. Ensure **Payment Status** is set to `Paid`
5. Click **Update Status**

**System Actions on Delivery:**
- Final history entry logged with timestamp
- Customer receives delivery confirmation notification
- Shipment counts toward "Delivered" analytics

---

### Step 7: Viewing Shipment History

Each shipment maintains a complete audit trail. Every status or location change is logged with:
- Status at time of update
- Location at time of update
- Note describing the change
- Timestamp

**Deduplication:** The system automatically prevents duplicate entries if status and location haven't changed.

---

## User Management

**Navigation:** Dashboard → Users Tab

### User List Display
| Column | Description |
|--------|-------------|
| **Name** | User's full name |
| **Email** | Account email address |
| **Role** | `Client` or `Admin` |
| **Joined** | Account creation date |
| **Actions** | Role toggle, edit options |

### Changing User Roles
1. Find the user in the list
2. Click `Make Admin` or `Make Client` button
3. Confirm the role change
4. User's access level updates immediately

### Inviting New Users
1. Click `+ Invite User` button
2. Enter email address
3. Select role (`Client` or `Admin`)
4. Click **Send Invite**
5. User receives email with signup link

---

## Support & Communication Center

**Navigation:** Dashboard → Support Tab

### Viewing Support Tickets
Tickets display with:
- Ticket ID
- User name and email
- Subject/Category
- Status (`Open`, `In Progress`, `Resolved`)
- Date created

### Managing Tickets
1. Click on a ticket to view full details
2. Read customer message and any attachments
3. Respond via the reply field
4. Update ticket status as needed
5. Customer receives notification of your response

---

## Mobile Management

The PerfectExpress Admin Console is fully responsive and works on mobile devices.

### Mobile Navigation
- Access global menu via the **hamburger icon** (☰) in the top header
- All dashboard tabs are accessible via swipe or menu selection
- Forms are optimized for touch input

### Mobile-Specific Tips
- Use Quick Actions for faster status updates on the go
- The shipment list scrolls vertically with essential info visible
- Tap any row to expand options

### Recommended Mobile Workflow
1. Open Dashboard on mobile browser
2. Navigate to Shipments tab
3. Search for shipment by tracking number
4. Use Quick Dispatch / Out for Delivery buttons
5. Confirm update

---

## Quick Reference: Tracking Number Formats

| Prefix | Source | Example |
|--------|--------|---------|
| `PFX-` | Client-created shipment | `PFX-74177696` |
| `PFX-` | Admin-created shipment | `PFX-GDWJCBZE` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Map not showing location | Ensure coordinates are set (use Google Maps link method) |
| Customer not receiving notifications | Verify email in their profile, check Resend API key |
| Cannot access admin features | Confirm your role is set to `Admin` in profiles table |
| Shipment not appearing | Check filter/search, verify shipment was saved successfully |

---

**End of Admin Onboarding Guide**

*For technical support, contact the development team or refer to the codebase documentation.*
