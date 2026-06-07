# Database Schema Documentation 🗄️

This document outlines the PostgreSQL database schema used for the **Silver Reunion 90 SMAN 90 Jakarta** portal. The application uses these tables to manage participants, custom configurations, collections, live interaction feeds, and reaction maps.

---

## 🗺️ Entity Relationship Overview

Below are the structured tables, columns, constraints, and relational definitions:

### 1. Table `participants`
Stores pre-registered students, payment status, live venue attendance checking information, and prize draws.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `text` | **Primary Key** | Unique participant identifier (e.g., UUID or system key) |
| `full_name` | `text` | Nullable | Alumnus complete name |
| `nick_name` | `text` | Nullable | Alumnus custom nickname/display name |
| `whatsapp` | `text` | Nullable | WhatsApp contact number |
| `class_of` | `text` | Nullable | SMAN 90 alumni class year or name (e.g., IPA 1, IPS 2) |
| `payment_checklist` | `bool` | Nullable | Indicates if the registrant has settled admission ticket fees |
| `htm` | `text` | Nullable | HTM fee classification |
| `donation` | `text` | Nullable | Custom donation details |
| `check_in` | `bool` | Nullable | Set to `true` when the attendee enters and checks in at the venue gates |
| `check_in_timestamp` | `timestamptz` | Nullable | Exact timestamp of ticket scanning at the gates |
| `board_member` | `bool` | Nullable | Designates if the attendee is a committee/board member |
| `check_in_sequence` | `int4` | Nullable | Sequential tracking of attendee arrival order |
| `door_prize` | `text` | Nullable | Label or identifier of a won door prize |
| `door_prize_timestamp` | `timestamptz` | Nullable | Exact timestamp of door prize assignment |
| `excel_registered_timestamp` | `text` | Nullable | Original registration timestamp transferred from reference files |

---

### 2. Table `configs`
Dynamic workspace-wide overrides controlling the core frontend variables like dates, timer parameters, toggling metrics visualization, or chat displays.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Entry created timestamp |
| `key` | `text` | Nullable | Unique configurations identifier (e.g., `EVENT_DATE`, `SHOW_QR_LINK`, `SHOW_ALUMNI_STATS`, `SHOW_FEEDBACK`) |
| `val` | `text` | Nullable | Configured value of the setting |

---

### 3. Table `photos`
Main catalog of collected memories, media archives, or uploaded photos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Entry created timestamp |
| `storage_bucket` | `text` | Nullable | Supabase or storage bucket catalog identifier |
| `storage_path` | `text` | Nullable | Direct relative file path in the storage solution |

---

### 4. Table `participant_photos`
Associates participants with uploaded photos, defining types of memories or profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Entry created timestamp |
| `participant_id` | `text` | Nullable | Foreign key referencing `participants.id` |
| `photo_id` | `int8` | Nullable | Foreign key referencing `photos.id` |
| `photo_type` | `text` | Nullable | Purpose classification (e.g., avatar, group memory) |
| `photo_event` | `text` | Nullable | Categorized reunion event |
| `is_primary` | `bool` | Nullable | Flags primary memory thumbnail photo |

---

### 5. Table `prizes`
Catalog of door prizes to be distributed during drawing sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Entry created timestamp |
| `name` | `text` | Nullable | Name of the gift/prize |
| `description` | `text` | Nullable | Prize specific detailing |
| `quota` | `int4` | Nullable | Registered total quantity of the specific reward |

---

### 6. Table `guest_book`
Alumni guest book tracking signatures or visits.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Entry created timestamp |
| `participant_id` | `text` | Nullable | Foreign key referencing `participants.id` |
| `message` | `text` | Nullable | Message context |

---

### 7. Table `feedback`
A forum storing direct messages, memories, and greetings ("Cuap-Cuap") submitted by participants. Also handles replies via parent-child thread relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Feedback submission timestamp |
| `participant_id` | `text` | Nullable | Foreign key referencing `participants.id` |
| `feedback` | `text` | Nullable | The textual context of the "Cuap-Cuap" (Max 500 characters) |
| `parent_id`| `int8` | Nullable | Self-referencing foreign key pointing to `feedback.id` for nested replies |

---

### 8. Table `feedback_reactions`
Tracks emoji-based reactions given to specific alumni post cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `int8` | **Primary Key, Identity** | Automatic incremented identity |
| `created_at` | `timestamptz` | Non-Nullable | Reaction submission timestamp |
| `feedback_id` | `int8` | Nullable | Foreign key referencing `feedback.id` |
| `participant_id` | `text` | Nullable | Foreign key referencing `participants.id` |
| `reaction` | `text` | Nullable | Specific reacted emoji code (e.g., `smile`, `heart`, `wow`, `pray`) |
