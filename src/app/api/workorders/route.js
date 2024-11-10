// app/api/workorders/route.js
import ExecuteQuery from '@/app/db/dbconfig'; // Adjust the path as necessary

export async function GET(request) {
  try {
    const openCount = await ExecuteQuery("SELECT COUNT(*) AS count FROM BB_WO WHERE WO_STATUS = 'Open'");
    const assignedCount = await ExecuteQuery("SELECT COUNT(*) AS count FROM BB_WO WHERE WO_STATUS = 'Assigned'");
    const closedCount = await ExecuteQuery("SELECT COUNT(*) AS count FROM BB_WO WHERE WO_STATUS = 'Closed'");

    return new Response(JSON.stringify({
      open: openCount[0]?.count || 0,
      assigned: assignedCount[0]?.count || 0,
      closed: closedCount[0]?.count || 0,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching work order counts:", error);
    return new Response("Error fetching work order counts", { status: 500 });
  }
}
