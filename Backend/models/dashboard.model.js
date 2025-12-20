import pool from "../db/db.js";

// Create dashboard_stats table
export const createDashboardStatsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS dashboard_stats (
      id SERIAL PRIMARY KEY,
      month VARCHAR(20) NOT NULL,
      year INTEGER DEFAULT 2025,
      hires INTEGER DEFAULT 0,
      attrition INTEGER DEFAULT 0,
      job_views INTEGER DEFAULT 0,
      job_applied INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await pool.query(query);
        console.log("✅ Dashboard Stats table created successfully");
        await seedDashboardStats();
    } catch (error) {
        console.error("❌ Error creating dashboard stats table:", error);
    }
};

// Seed initial data if table is empty
const seedDashboardStats = async () => {
    try {
        const checkQuery = "SELECT COUNT(*) FROM dashboard_stats";
        const { rows } = await pool.query(checkQuery);
        if (parseInt(rows[0].count) > 0) return; // Already seeded

        console.log("🌱 Seeding dashboard stats...");

        const dummyData = [
            { month: "Jan", hires: 25, attrition: 10, job_views: 150, job_applied: 45 },
            { month: "Feb", hires: 140, attrition: 20, job_views: 300, job_applied: 120 },
            { month: "Mar", hires: 80, attrition: 40, job_views: 250, job_applied: 90 },
            { month: "Apr", hires: 120, attrition: 30, job_views: 280, job_applied: 110 },
            { month: "May", hires: 200, attrition: 50, job_views: 400, job_applied: 180 },
            { month: "Jun", hires: 30, attrition: 70, job_views: 100, job_applied: 30 },
            { month: "Jul", hires: 160, attrition: 40, job_views: 320, job_applied: 150 },
            { month: "Aug", hires: 90, attrition: 60, job_views: 200, job_applied: 80 },
            { month: "Sep", hires: 70, attrition: 50, job_views: 180, job_applied: 60 },
            { month: "Oct", hires: 110, attrition: 40, job_views: 220, job_applied: 100 },
            { month: "Nov", hires: 130, attrition: 25, job_views: 260, job_applied: 120 },
            { month: "Dec", hires: 120, attrition: 15, job_views: 240, job_applied: 115 }
        ];

        for (const data of dummyData) {
            await pool.query(
                `INSERT INTO dashboard_stats (month, hires, attrition, job_views, job_applied) VALUES ($1, $2, $3, $4, $5)`,
                [data.month, data.hires, data.attrition, data.job_views, data.job_applied]
            );
        }
        console.log("✅ Dashboard Stats seeded successfully");

    } catch (error) {
        console.error("❌ Error seeding dashboard stats:", error);
    }
};

// Get all stats
export const getDashboardStats = async () => {
    return pool.query("SELECT * FROM dashboard_stats ORDER BY id ASC");
};

export const getOverviewStats = async () => {
    try {
        // 1. Total Employees (Active)
        const totalEmpQuery = await pool.query("SELECT COUNT(*) FROM users WHERE status != 'Resigned' AND status != 'Inactive'");
        const totalEmployees = parseInt(totalEmpQuery.rows[0].count);

        // 2. Resigned Employees
        const resignedQuery = await pool.query("SELECT COUNT(*) FROM users WHERE status = 'Resigned' OR status = 'Inactive'");
        const resignedEmployees = parseInt(resignedQuery.rows[0].count);

        // 3. Job Views (Sum of views column in jobs)
        const jobViewsQuery = await pool.query("SELECT COALESCE(SUM(views), 0) as total_views FROM jobs");
        const jobViews = parseInt(jobViewsQuery.rows[0].total_views);

        // 4. Job Applications (Count of applications)
        const applicationsQuery = await pool.query("SELECT COUNT(*) FROM applications");
        const jobApplications = parseInt(applicationsQuery.rows[0].count);

        // 5. Gender Composition
        const maleQuery = await pool.query("SELECT COUNT(*) FROM users WHERE gender = 'Male'");
        const femaleQuery = await pool.query("SELECT COUNT(*) FROM users WHERE gender = 'Female'");
        const maleCount = parseInt(maleQuery.rows[0].count);
        const femaleCount = parseInt(femaleQuery.rows[0].count);

        // Calculate percentages
        const totalForGender = maleCount + femaleCount; // Only counting those with specified gender for the chart ratio? 
        // Or should we use totalEmployees? Let's use totalForGender to avoid 0 division if many unspecified.
        // Actually, let's just return the raw counts and let frontend handle percentages or calc here.
        // Let's calc percentages of the *known* gender pool for better visualization if stats are sparse.

        let malePercent = 0;
        let femalePercent = 0;
        if (totalForGender > 0) {
            malePercent = Math.round((maleCount / totalForGender) * 100);
            femalePercent = Math.round((femaleCount / totalForGender) * 100);
        }

        return {
            totalEmployees,
            resignedEmployees,
            jobViews,
            jobApplications,
            genderComposition: {
                male: maleCount,
                female: femaleCount,
                malePercent,
                femalePercent
            }
        };
    } catch (error) {
        console.error("Error fetching overview stats:", error);
        throw error;
    }
};
