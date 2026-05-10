# Database Migrations

After running `schema.sql`, run the migrations to add new features:

## In phpMyAdmin:
1. Select the `iilms` database
2. Click the **SQL** tab
3. Open `server/db/migrations.sql`, copy all content, paste and click **Go**

## What migrations.sql adds:
- Extended `Users` table: phone, address, bio, photo_url, is_verified, verify_token
- `StudentProfiles` table: first_name, last_name, university_id, sex, gpa, skills, linkedin_url, testimonial
- `CompanyProfiles` table: company_name, industry, size, contact details, address, testimonial
- `AdminProfiles` table: department, university, staff_id
- `ChatMessages` table: chatbot conversation history
