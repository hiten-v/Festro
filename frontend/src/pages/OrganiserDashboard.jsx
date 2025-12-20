// import React, { useState, useEffect } from 'react';

// const OrganiserDashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/auth/me', {
//           credentials: 'include'
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data.user);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Organiser Dashboard</h1>
//       {userData && (
//         <div className="mt-4">
//           <p>Welcome, {userData.name}!</p>
//           <p>Email: {userData.email}</p>
//           <p>Role: {userData.role}</p>
//         </div>
//       )}
//       {/* Your user dashboard content */}
//     </div>
//   );
// };

// export default OrganiserDashboard;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../component/Toast';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaRupeeSign, 
  FaChartLine,
  FaArrowUp,
} from 'react-icons/fa';

const OrganiserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    revenueToday: 0,
    avgTicketPrice: 0,
    topEventName: 'N/A'
  });
  const [recentSales, setRecentSales] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    price: '',
    category: 'Music',
    description: '',
    image: null
  });

  // Check if user is organizer
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'organiser') {
            setIsOrganizer(true);
            fetchDashboardData();
          } else {
            navigate('/'); // Redirect to home if not organizer
          }
        } else {
          navigate('/login'); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();

      if (data && data.stats) {
        setStats(prev => ({ ...prev, ...data.stats }));
      }
      if (data && Array.isArray(data.recentSales)) {
        setRecentSales(data.recentSales);
      }
      if (data && Array.isArray(data.categoryData)) {
        setCategoryData(data.categoryData);
      }
      if (data && Array.isArray(data.dailySales)) {
        setDailySales(data.dailySales);
      }
      if (data && Array.isArray(data.monthlySales)) {
        setMonthlySales(data.monthlySales);
      }

    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };


  const [toast, setToast] = useState({
      show: false,
      message: "",
      type: "success",
      });
  
  const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });
  setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
  }, 3000);
  };



  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'price') {
          data.append(key, parseFloat(formData[key]));
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        credentials: 'include',
        body: data
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create event');
      }
      showToast("Event created successfully!",success);
      setShowCreateModal(false);
      fetchDashboardData();
      setFormData({
        title: '', 
        date: '', 
        time: '', 
        location: '', 
        price: '', 
        category: 'Music', 
        description: '', 
        image: null
      });
    } catch (error) {
      console.error("Create event error:", error);
      showToast(error.message || "Failed to create event",error);
    }
  };



  const [downloading, setDownloading] = useState(false);


  // const downloadSimpleReport = async () => {
  //   try {
  //     setDownloading(true);
      
  //     const response = await fetch('http://localhost:5000/api/report/simple-report', {
  //       credentials: 'include'
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to generate report');
  //     }

  //     // Create blob from response
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
      
  //     a.href = url;
  //     a.download = 'festro-sales-report.pdf';
  //     document.body.appendChild(a);
  //     a.click();
      
  //     // Cleanup
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
      
  //     showToast('Report downloaded successfully!', 'success');
      
  //   } catch (error) {
  //     console.error('Download report error:', error);
  //     showToast('Failed to download report', 'error');
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const downloadReport = async () => {
    try {
      setDownloading(true);
      
      // First test if data exists
      const testResponse = await fetch('http://localhost:5000/api/report/test-fix', {
        credentials: 'include'
      });
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        
        if (testData.myBookings === 0) {
          showToast(`No bookings found.\n\nTotal bookings in system: ${testData.totalBookings}\nYour events: ${testData.myEvents}\nYour bookings: ${testData.myBookings}`,"error");
          setDownloading(false);
          return;
        }
      }
      
      // Generate PDF
      const response = await fetch('http://localhost:5000/api/report/simple-report', {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `festro-sales-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('Report downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('Error:', error);
      showToast('Error: ' + error.message, 'error');
    } finally {
      setDownloading(false);
    }
  };


  if (!isOrganizer) {
    return (
      <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Organizer Access Required</h2>
          <p className="text-stone-600 mb-4">You need organizer privileges to access this dashboard.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#702c2c] text-white rounded-lg hover:bg-[#5a2323]"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-[#ebe9e1] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#702c2c] mb-4"></div>
        <p className="text-stone-600">Loading organizer dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#ebe9e1] flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4 text-red-500">⚠️</div>
      <p className="text-red-600 mb-4 text-center">{error}</p>
      <button 
        onClick={fetchDashboardData} 
        className="px-6 py-2 bg-[#702c2c] text-white rounded-lg hover:bg-[#5a2323]"
      >
        Retry
      </button>
    </div>
  );



  const maxCategoryRevenue = categoryData.length > 0 
    ? Math.max(...categoryData.map(c => {
        const val = c?.value || c?.revenue || 0;
        // console.log('Category value:', c, '->', val);
        return Number(val);
      })) 
    : 1;

  const maxDailyRevenue = dailySales.length > 0 
    ? Math.max(...dailySales.map(d => {
        const val = d?.revenue || 0;
        // console.log('Daily value:', d, '->', val);
        return Number(val);
      })) 
    : 1;

  const maxMonthlyRevenue = monthlySales.length > 0 
    ? Math.max(...monthlySales.map(m => {
        const val = m?.revenue || 0;
        // console.log('Monthly value:', m, '->', val);
        return Number(val);
      })) 
    : 1;



  return (
    <div className="min-h-screen bg-[#ebe9e1] font-sans text-slate-900 ">
      <Toast toast={toast} setToast={setToast} />
      <div className="w-full bg-slate-900 top-0 bottom-90 p-11.5"></div>
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Organizer Dashboard</h1>
            <p className="text-stone-600">Manage your events and track sales performance</p>
          </div>
          <div className="flex gap-3 max-md:pt-4">
            <button
              onClick={() => navigate('/events')}
              className="px-5 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              Browse Events
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2 bg-[#702c2c] text-white rounded-lg font-medium hover:bg-[#5a2323] transition-colors flex items-center gap-2"
            >
              <FaPlus /> Create Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-200 rounded-lg">
                <FaCalendarAlt className="text-slate-900 text-lg" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <FaArrowUp /> Events
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalEvents || 0}</p>
            <p className="text-sm text-stone-500">Total Events</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-200 rounded-lg">
                <FaTicketAlt className="text-slate-900 text-lg" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <FaArrowUp /> Tickets
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalTicketsSold || 0}</p>
            <p className="text-sm text-stone-500">Tickets Sold</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-200 rounded-lg">
                <FaRupeeSign className="text-slate-900 text-lg" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <FaArrowUp /> Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">₹{((stats?.totalRevenue || 0).toFixed(2))}</p>
            <p className="text-sm text-stone-500">Total Revenue</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-slate-200 rounded-lg">
                <FaChartLine className="text-slate-900 text-lg" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <FaArrowUp /> Avg
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">₹{((stats?.avgTicketPrice || 0).toFixed(2))}</p>
            <p className="text-sm text-stone-500">Avg Ticket Price</p>
          </div>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-linear-to-r from-[#702c2c] to-[#8a3a3a] text-white p-5 rounded-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today's Revenue</p>
              <p className="text-3xl font-bold mt-1">₹{((stats?.revenueToday || 0).toFixed(2))}</p>
              <p className="text-sm opacity-80 mt-2">From today's ticket sales</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Daily Sales (Last 7 Days)</h3>
              <span className="text-xs text-stone-500">Revenue</span>
            </div>
            
            <div className="h-40 flex items-end justify-between gap-1 px-2">
              {dailySales.map((d, i) => {
                const revenue = d.revenue || 0;
                const barHeight = maxDailyRevenue > 0 
                  ? (revenue / maxDailyRevenue) * 100 
                  : 0;
                
                return (
                  <div key={i} className="flex flex-col items-center flex-1 h-full">
                    {/* Day label */}
                    <div className="text-xs text-stone-500 mb-1">{d.day}</div>
                    
                    {/* Value */}
                    <div className="text-xs font-bold text-slate-800 mb-1">
                      ₹{revenue.toFixed(0)}
                    </div>
                    
                    {/* Bar */}
                    <div
                      className="w-3/4 bg-linear-to-t from-[#702c2c] to-[#8a3a3a] rounded-t-lg"
                      style={{ 
                        height: `${barHeight}%`,
                        minHeight: '2px'
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Monthly Sales (Last 6 Months)</h3>
              <span className="text-xs text-stone-500">Revenue</span>
            </div>
            
            <div className="h-40 flex items-end justify-between gap-1 px-2">
              {monthlySales.map((m, i) => {
                const revenue = m.revenue || 0;
                const barHeight = maxMonthlyRevenue > 0 
                  ? (revenue / maxMonthlyRevenue) * 100 
                  : 0;
                
                return (
                  <div key={i} className="flex flex-col items-center flex-1 h-full">
                    {/* Month label */}
                    <div className="text-xs text-stone-500 mb-1">{m.month}</div>
                    
                    {/* Value */}
                    <div className="text-xs font-bold text-slate-800 mb-1">
                      ₹{revenue.toFixed(0)}
                    </div>
                    
                    {/* Bar */}
                    <div
                      className="w-3/4 bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg"
                      style={{ 
                        height: `${barHeight}%`,
                        minHeight: '2px'
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category + Sales Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Revenue by Category</h3>
            <div className="space-y-4">
              {categoryData.length > 0 ? categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-800">{cat?.name || 'Unknown'}</span>
                      <span className="font-semibold text-slate-900">₹{(cat?.value || 0).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div 
                        className="bg-linear-to-r from-[#702c2c] to-[#8a3a3a] h-2 rounded-full"
                        style={{ width: `${maxCategoryRevenue > 0 ? ((cat?.value || 0) / maxCategoryRevenue) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3 text-stone-300">📊</div>
                  <p className="text-stone-500">No category data yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-lg font-semibold text-slate-900">Recent Ticket Sales</h3>
              <p className="text-sm text-stone-500 mt-1">Latest bookings for your events</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Event</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Tickets</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentSales && recentSales.length > 0 ? recentSales.map((sale, index) => (
                    <tr key={sale?._id || index} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-800">{sale?.event?.title || 'Unknown Event'}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-sm text-slate-700">{sale?.user?.name || 'Guest User'}</div>
                        <div className="text-xs text-stone-500">{sale?.user?.email || 'No email'}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sale?.tickets || 0} tickets
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-slate-900">₹{(sale?.totalAmount || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-stone-500">
                        {sale?.bookingDate ? new Date(sale.bookingDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-10 text-center">
                        <div className="text-4xl mb-3 text-stone-300">🛒</div>
                        <p className="text-stone-500">No sales yet.</p>
                        <p className="text-sm text-stone-400 mt-1">Create your first event to start selling tickets!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* {recentSales.length > 0 && (
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
                <button 
                  onClick={() => }
                  className="text-sm text-[#702c2c] hover:underline font-medium"
                >
                  View all sales →
                </button>
              </div>
            )} */}

            {recentSales.length > 0 && (
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
                <button 
                  onClick={downloadReport}
                  disabled={downloading}
                  className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    downloading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#702c2c] hover:bg-[#5a2323]'
                  } text-white`}
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      Download Sales Report
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-stone-100 bg-linear-to-r from-[#702c2c] to-[#8a3a3a] text-white">
              <h2 className="text-xl font-bold">Create New Event</h2>
              <p className="text-sm opacity-90 mt-1">Fill in the details for your event</p>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input 
                      required 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.date} 
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
                    <input 
                      required 
                      type="time" 
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.time} 
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.location} 
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                      placeholder="0 for free event"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                      <option value="Food">Food</option>
                      <option value="Technology">Technology</option>
                      <option value="Sports">Sports</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea 
                    required 
                    rows="3" 
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#702c2c]/20 focus:border-[#702c2c] outline-none"
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Describe your event in detail..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Image *</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      id="eventImg" 
                      required 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
                    />
                    <label 
                      htmlFor="eventImg"
                      className="px-4 py-2.5 bg-stone-100 border border-stone-200 text-slate-700 rounded-lg font-medium cursor-pointer hover:bg-stone-200 transition-colors"
                    >
                      Choose Image
                    </label>
                    <span className="text-sm text-stone-600 truncate max-w-[200px]">
                      {formData.image ? formData.image.name : 'No image selected'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">Recommended size: 1200x800 pixels</p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#702c2c] text-white rounded-lg font-medium hover:bg-[#5a2323] transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganiserDashboard;


