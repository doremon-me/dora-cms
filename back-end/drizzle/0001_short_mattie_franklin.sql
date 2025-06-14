CREATE VIEW "public"."public_projects_view" AS (  
        SELECT id, 
        name, 
        description, 
        type, 
        origin, 
        created_at, 
        updated_at 
        FROM projects 
        WHERE is_deleted = false
    );