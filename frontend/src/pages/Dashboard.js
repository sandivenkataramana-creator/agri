import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ListModal from '../components/ListModal';
import { Pie, Bar, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiUsers, FiFileText, FiDollarSign, FiTrendingUp, FiActivity, FiPieChart, FiBarChart2, FiFilter } from 'react-icons/fi';
import {
  getDashboardStats,
  getDashboardQuickStats,
  getSchemesByCategory,
  getHODsByDepartment,
  getBudgetByHOD,
  getSchemesByHOD,
  getAttendanceByHOD,
  getRevenueByHOD,
  getRevenueByDepartment,
  getHODs,
  getSchemesByHODId,
  getBudgetByHODId,
  getAttendanceByHODId,
  getAttendance,
  getRevenueByHODId
} from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHods: 0,
    totalSchemes: 0,
    totalStaff: 0,
    totalBudget: 0,
    utilizedBudget: 0
  });
  const [quickStats, setQuickStats] = useState({
    budgetUtilization: 0,
    totalBudget: 0,
    utilizedBudget: 0,
    remainingBudget: 0,
    districtsCovered: 0,
    beneficiaries: 0,
    attendanceRate: 0,
    nodalOfficers: 0
  });
  const [schemesByCategory, setSchemesByCategory] = useState([]);
  const [hodsByDepartment, setHODsByDepartment] = useState([]);
  const [budgetByHOD, setBudgetByHOD] = useState([]);
  const [schemesByHOD, setSchemesByHOD] = useState([]);
  const [attendanceByHOD, setAttendanceByHOD] = useState([]);
  const [revenueByHOD, setRevenueByHOD] = useState([]);
  const [revenueByDepartment, setRevenueByDepartment] = useState([]);
  const [allHODs, setAllHODs] = useState([]);
  const [selectedHOD, setSelectedHOD] = useState('');
  const [selectedHODTable, setSelectedHODTable] = useState({ schemes: '', budget: '', attendance: '', revenue: '' });
  const [revenueDetails, setRevenueDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ year: 'All', month: 'All', date: '', hod_id: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', items: [], columns: [] });
  // Chart filter states
  const [chartFilters, setChartFilters] = useState({
    revenue: { hod_id: '' },
    schemes: { hod_id: '' },
    budget: { hod_id: '' },
    attendance: { hod_id: '' }
  });
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null);
  // Detailed data for tables when HOD is selected
  const [schemesDetails, setSchemesDetails] = useState([]);
  const [budgetDetails, setBudgetDetails] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState([]);

  useEffect(() => {
    // initial load
    fetchHODsList();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Refetch data when HOD filter changes
    if (selectedHOD) {
      fetchDashboardData({ ...filters, hod_id: selectedHOD });
      fetchDetailedTableData(selectedHOD);
    } else {
      fetchDashboardData();
      setSchemesDetails([]);
      setBudgetDetails([]);
      setAttendanceDetails([]);
    }
  }, [selectedHOD]);

  // Fetch schemesDetails when chart filter changes
  useEffect(() => {
    if (chartFilters.schemes.hod_id) {
      getSchemesByHODId(chartFilters.schemes.hod_id)
        .then(res => setSchemesDetails(res.data || []))
        .catch(err => console.error('Error fetching schemes details:', err));
    } else if (!selectedHOD && !selectedHODTable.schemes) {
      setSchemesDetails([]);
    }
  }, [chartFilters.schemes.hod_id]);

  const fetchDetailedTableData = async (hodId) => {
    try {
      const [schemesRes, budgetRes, attendanceRes] = await Promise.all([
        getSchemesByHODId(hodId),
        getBudgetByHODId(hodId),
        getAttendanceByHODId(hodId)
      ]);
      setSchemesDetails(schemesRes.data || []);
      setBudgetDetails(budgetRes.data || []);
      setAttendanceDetails(attendanceRes.data || []);
    } catch (err) {
      console.error('Error fetching detailed table data:', err);
    }
  };

  const fetchHODsList = async () => {
    try {
      const response = await getHODs();
      setAllHODs(response.data || []);
    } catch (err) {
      console.error('Error fetching HODs list:', err);
    }
  };

  const fetchDashboardData = async (overrideFilters = null) => {
    const f = overrideFilters || filters;
    const params = {};
    if (f.year && f.year !== 'All') params.year = f.year;
    if (f.month && f.month !== 'All') params.month = f.month;
    if (f.date) params.date = f.date;
    if (f.hod_id) params.hod_id = f.hod_id;

    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel (pass filters as query params)
      const [
        statsRes,
        quickStatsRes,
        categoryRes,
        hodsDeptRes,
        budgetRes,
        schemesHODRes,
        attendanceRes,
        revenueRes,
        revenueDeptRes
      ] = await Promise.all([
        getDashboardStats(params),
        getDashboardQuickStats(params),
        getSchemesByCategory(params),
        getHODsByDepartment(params),
        getBudgetByHOD(params),
        getSchemesByHOD(params),
        getAttendanceByHOD(params),
        getRevenueByHOD(params),
        getRevenueByDepartment(params)
      ]);

      // Set stats
      setStats({
        totalHods: statsRes.data.totalHods || 0,
        totalSchemes: statsRes.data.totalSchemes || 0,
        totalStaff: statsRes.data.totalStaff || 0,
        totalBudget: parseFloat(statsRes.data.totalBudget) || 0,
        utilizedBudget: parseFloat(statsRes.data.utilizedBudget) || 0
      });

      // Set quick stats
      setQuickStats({
        budgetUtilization: quickStatsRes.data.budgetUtilization || 0,
        totalBudget: parseFloat(quickStatsRes.data.totalBudget) || 0,
        utilizedBudget: parseFloat(quickStatsRes.data.utilizedBudget) || 0,
        remainingBudget: parseFloat(quickStatsRes.data.remainingBudget) || 0,
        districtsCovered: quickStatsRes.data.districtsCovered || 0,
        beneficiaries: quickStatsRes.data.beneficiaries || 0,
        attendanceRate: quickStatsRes.data.attendanceRate || 0,
        nodalOfficers: quickStatsRes.data.nodalOfficers || 0
      });

      // Set schemes by category
      setSchemesByCategory(categoryRes.data || []);

      // Set HODs by department
      setHODsByDepartment(hodsDeptRes.data || []);

      // Set budget by HOD
      setBudgetByHOD(budgetRes.data || []);

      // Set schemes by HOD
      setSchemesByHOD(schemesHODRes.data || []);

      // Set attendance by HOD
      setAttendanceByHOD(attendanceRes.data || []);

      // Set revenue by HOD
      setRevenueByHOD(revenueRes.data || []);

      // Set revenue by department
      setRevenueByDepartment(revenueDeptRes.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please make sure the server is running.');
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '₹0';
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const formatBeneficiaries = (count) => {
    if (count >= 100000) {
      return `${(count / 100000).toFixed(0)}L+`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K+`;
    }
    return count.toString();
  };

  const formatCompactNumber = (value) => {
    if (value === null || value === undefined) return '0';
    const v = Number(value);
    if (isNaN(v)) return String(value);
    if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(2)}M`;
    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(2)}K`;
    return v.toString();
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Handle chart filter change
  const handleChartFilterChange = (chartType, hodId) => {
    setChartFilters(prev => ({
      ...prev,
      [chartType]: { hod_id: hodId }
    }));
    setOpenFilterDropdown(null);
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = (chartType) => {
    setOpenFilterDropdown(openFilterDropdown === chartType ? null : chartType);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.chart-filter-container')) {
        setOpenFilterDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get filtered data for each chart
  const getFilteredRevenueData = () => {
    if (chartFilters.revenue.hod_id) {
      return revenueByHOD.filter(item => item.hod_name === allHODs.find(h => h.id === parseInt(chartFilters.revenue.hod_id))?.name);
    }
    return revenueByHOD;
  };

  const getFilteredSchemesData = () => {
    if (chartFilters.schemes.hod_id) {
      return schemesByHOD.filter(item => item.hod_name === allHODs.find(h => h.id === parseInt(chartFilters.schemes.hod_id))?.name);
    }
    return schemesByHOD;
  };

  const getFilteredBudgetData = () => {
    if (chartFilters.budget.hod_id) {
      return budgetByHOD.filter(item => item.hod_name === allHODs.find(h => h.id === parseInt(chartFilters.budget.hod_id))?.name);
    }
    return budgetByHOD;
  };

  const getFilteredAttendanceData = () => {
    if (chartFilters.attendance.hod_id) {
      return attendanceByHOD.filter(item => item.hod_name === allHODs.find(h => h.id === parseInt(chartFilters.attendance.hod_id))?.name);
    }
    return attendanceByHOD;
  };

  // Render filter dropdown
  const renderFilterDropdown = (chartType) => {
    if (openFilterDropdown !== chartType) return null;
    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '200px',
        padding: '8px 0'
      }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontWeight: '600', color: '#333' }}>
          Filter by HOD
        </div>
        <div 
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer',
            backgroundColor: !chartFilters[chartType].hod_id ? '#e8f5e9' : 'transparent',
            color: !chartFilters[chartType].hod_id ? '#2e7d32' : '#333'
          }}
          onClick={() => handleChartFilterChange(chartType, '')}
        >
          All HODs
        </div>
        {allHODs.map(hod => (
          <div 
            key={hod.id}
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              backgroundColor: chartFilters[chartType].hod_id === String(hod.id) ? '#e8f5e9' : 'transparent',
              color: chartFilters[chartType].hod_id === String(hod.id) ? '#2e7d32' : '#333'
            }}
            onClick={() => handleChartFilterChange(chartType, String(hod.id))}
            onMouseEnter={(e) => e.target.style.backgroundColor = chartFilters[chartType].hod_id === String(hod.id) ? '#e8f5e9' : '#f5f5f5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = chartFilters[chartType].hod_id === String(hod.id) ? '#e8f5e9' : 'transparent'}
          >
            {hod.name}
          </div>
        ))}
      </div>
    );
  };

  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Dashboard Statistics Sheet
    const statsData = [
      ['Dashboard Statistics', ''],
      ['', ''],
      ['Metric', 'Value'],
      ['Total HODs', stats.totalHods],
      ['Total Schemes', stats.totalSchemes],
      ['Total Staff', stats.totalStaff],
      ['Total Budget', formatCurrency(stats.totalBudget)],
      ['Utilized Budget', formatCurrency(stats.utilizedBudget)],
      ['Budget Utilization %', `${quickStats.budgetUtilization}%`],
      ['Districts Covered', quickStats.districtsCovered],
      ['Beneficiaries', formatCompactNumber(quickStats.beneficiaries)],
      ['Attendance Rate %', `${quickStats.attendanceRate}%`],
      ['Nodal Officers', quickStats.nodalOfficers]
    ];
    const wsStats = XLSX.utils.aoa_to_sheet(statsData);
    
    // Add styling (header row)
    wsStats['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsStats, 'Statistics');
    
    // Schemes by HOD Sheet
    const schemesData = [
      ['Schemes by HOD', ''],
      ['', ''],
      ['HOD Name', 'Total Schemes', 'Total Budget', 'Status']
    ];
    const filteredSchemes = selectedHOD 
      ? schemesDetails.map(s => [s.hod_name || allHODs.find(h => h.id === parseInt(selectedHOD))?.name, s.name, formatCurrency(s.total_budget), s.status])
      : schemesByHOD.map(s => [s.hod_name, s.scheme_count, formatCurrency(s.total_budget), 'Active']);
    
    if (selectedHOD && schemesDetails.length > 0) {
      schemesData.push(['', '', '', '']);
      schemesData.push(['Detailed Schemes:', '', '', '']);
      schemesData.push(['Scheme Name', 'HOD', 'Budget', 'Status']);
      schemesDetails.forEach(s => {
        schemesData.push([s.name, s.hod_name || allHODs.find(h => h.id === parseInt(selectedHOD))?.name, formatCurrency(s.total_budget), s.status]);
      });
    } else {
      schemesData.push(...filteredSchemes);
    }
    
    const wsSchemes = XLSX.utils.aoa_to_sheet(schemesData);
    wsSchemes['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSchemes, 'Schemes');
    
    // Budget by HOD Sheet
    const budgetData = [
      ['Budget by HOD', ''],
      ['', ''],
      ['HOD', 'Department', 'Allocated', 'Utilized', 'Utilization %']
    ];
    const filteredBudget = selectedHOD && budgetDetails.length > 0
      ? budgetDetails.map(b => [
          allHODs.find(h => h.id === parseInt(selectedHOD))?.name || b.hod_name,
          b.department || '',
          formatCurrency(b.allocated_amount),
          formatCurrency(b.utilized_amount),
          `${((b.utilized_amount / b.allocated_amount) * 100).toFixed(1)}%`
        ])
      : budgetByHOD.map(b => [
          b.hod_name,
          b.department,
          formatCurrency(b.allocated),
          formatCurrency(b.utilized),
          `${((b.utilized / b.allocated) * 100).toFixed(1)}%`
        ]);
    budgetData.push(...filteredBudget);
    
    const wsBudget = XLSX.utils.aoa_to_sheet(budgetData);
    wsBudget['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsBudget, 'Budget');
    
    // Attendance Summary Sheet
    const attendanceData = [
      ['Attendance Summary by HOD', ''],
      ['', ''],
      ['Department/HOD', 'Present', 'Absent', 'Half Day', 'On Leave', 'Attendance %']
    ];
    const filteredAttendance = selectedHOD && attendanceDetails.length > 0
      ? (() => {
          const summary = attendanceDetails.reduce((acc, a) => {
            acc.present = acc.present + (a.status === 'present' ? 1 : 0);
            acc.absent = acc.absent + (a.status === 'absent' ? 1 : 0);
            acc.half_day = acc.half_day + (a.status === 'half_day' ? 1 : 0);
            acc.on_leave = acc.on_leave + (a.status === 'on_leave' ? 1 : 0);
            return acc;
          }, { present: 0, absent: 0, half_day: 0, on_leave: 0 });
          const total = summary.present + summary.absent + summary.half_day + summary.on_leave;
          const percentage = total > 0 ? ((summary.present / total) * 100).toFixed(1) : 0;
          return [[
            allHODs.find(h => h.id === parseInt(selectedHOD))?.name || 'Selected HOD',
            summary.present,
            summary.absent,
            summary.half_day,
            summary.on_leave,
            `${percentage}%`
          ]];
        })()
      : attendanceByHOD.map(a => {
          const total = a.present + a.absent + a.half_day + (a.on_leave || 0);
          const percentage = total > 0 ? ((a.present / total) * 100).toFixed(1) : 0;
          return [a.hod_name, a.present, a.absent, a.half_day, a.on_leave || 0, `${percentage}%`];
        });
    attendanceData.push(...filteredAttendance);
    
    const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceData);
    wsAttendance['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsAttendance, 'Attendance');
    
    // Write file
    const fileName = `dashboard_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Pie chart for HODs by Department (like reference image)
  const hodsByDepartmentChartData = {
    labels: hodsByDepartment.map(item => {
      const count = item.count || 0;
      const countLabel = count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toString();
      return `${item.category} (${countLabel})`;
    }),
    datasets: [{
      data: hodsByDepartment.map(item => item.count || 0),
      backgroundColor: [
        '#FFD700', // Yellow/Gold
        '#9C27B0', // Purple
        '#FF9800', // Orange
        '#00BCD4', // Teal/Cyan
        '#2196F3', // Light Blue
        '#E91E63', // Pink
        '#4CAF50', // Green
        '#F44336'  // Red
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const schemesCategoryChartData = {
    labels: schemesByCategory.map(item => item.category),
    datasets: [{
      data: schemesByCategory.map(item => item.budget),
      backgroundColor: [
        '#1565c0',
        '#2e7d32',
        '#ef6c00',
        '#7b1fa2',
        '#c62828',
        '#00838f'
      ],
      borderWidth: 0
    }]
  };

  const budgetHODChartData = {
    labels: budgetByHOD.map(item => item.department),
    datasets: [
      {
        label: 'Allocated',
        data: budgetByHOD.map(item => item.allocated / 10000000),
        backgroundColor: '#1565c0',
        borderRadius: 4,
      },
      {
        label: 'Utilized',
        data: budgetByHOD.map(item => item.utilized / 10000000),
        backgroundColor: '#2e7d32',
        borderRadius: 4,
      }
    ]
  };

  // Pie chart for Schemes by HOD
  const schemesHODPieChartData = {
    labels: schemesByHOD.map(item => item.hod_name),
    datasets: [{
      data: schemesByHOD.map(item => item.scheme_count || 0),
      backgroundColor: [
        '#1565c0', // Blue
        '#2e7d32', // Green
        '#ef6c00', // Orange
        '#7b1fa2', // Purple
        '#c62828', // Red
        '#00838f', // Teal
        '#FFD700', // Gold
        '#E91E63', // Pink
        '#795548', // Brown
        '#607D8B'  // Blue Grey
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8
    }]
  };

  // Pie chart for Budget by HOD (allocated amounts with Cr/Lakhs formatting)
  const filteredBudgetData = getFilteredBudgetData();
  const budgetHODPieChartData = {
    labels: filteredBudgetData.map(item => {
      const budget = item.allocated || 0;
      const budgetLabel = budget >= 10000000 ? `${(budget / 10000000).toFixed(1)}Cr` : 
                          budget >= 100000 ? `${(budget / 100000).toFixed(1)}L` :
                          budget >= 1000 ? `${(budget / 1000).toFixed(0)}K` : budget.toString();
      return `${item.hod_name} (${budgetLabel})`;
    }),
    datasets: [{
      data: filteredBudgetData.map(item => item.allocated || 0),
      backgroundColor: [
        '#1565c0', // Blue
        '#2e7d32', // Green
        '#ef6c00', // Orange
        '#7b1fa2', // Purple
        '#c62828', // Red
        '#00838f', // Teal
        '#FFD700', // Gold
        '#E91E63', // Pink
        '#795548', // Brown
        '#607D8B'  // Blue Grey
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8
    }]
  };

  // Pie chart for Attendance by HOD (Present, Absent, Half Day, Late, Leave)
  const filteredAttendanceData = getFilteredAttendanceData();
  const attendanceTotalsForChart = filteredAttendanceData.reduce((acc, item) => {
    acc.present += item.present || 0;
    acc.absent += item.absent || 0;
    acc.half_day += item.half_day || 0;
    acc.late += item.late || 0;
    acc.on_leave += item.on_leave || 0;
    return acc;
  }, { present: 0, absent: 0, half_day: 0, late: 0, on_leave: 0 });

  const attendanceHODPieChartData = {
    labels: ['Present', 'Absent', 'Half Day', 'Late', 'Leave'],
    datasets: [{
      data: [
        attendanceTotalsForChart.present,
        attendanceTotalsForChart.absent,
        attendanceTotalsForChart.half_day,
        attendanceTotalsForChart.late,
        attendanceTotalsForChart.on_leave
      ],
      backgroundColor: [
        '#4CAF50', // Green for Present
        '#F44336', // Red for Absent
        '#FF9800', // Orange for Half Day
        '#9C27B0', // Purple for Late
        '#2196F3'  // Blue for Leave
      ],
      borderWidth: 0,
      hoverOffset: 10,
      // Spacing between slices
      spacing: 2
    }]
  };

  // HOD Revenue Pie Chart Data (showing department with formatted amounts)
  const filteredRevenueData = getFilteredRevenueData();
  const hodRevenueChartData = {
    labels: filteredRevenueData.map(item => {
      const revenue = item.total_revenue || 0;
      const revenueLabel = revenue >= 10000000 ? `${(revenue / 10000000).toFixed(0)}Cr` : 
                           revenue >= 100000 ? `${(revenue / 100000).toFixed(0)}L` :
                           revenue >= 1000 ? `${(revenue / 1000).toFixed(0)}K` : 
                           revenue > 0 ? revenue.toString() : '0';
      // Use department name instead of hod_name
      const deptName = item.department || item.hod_name || 'Unknown';
      return `${deptName} (${revenueLabel})`;
    }),
    datasets: [{
      data: filteredRevenueData.map(item => item.total_revenue || 0),
      backgroundColor: [
        '#FFD700', // Yellow/Gold
        '#7B68EE', // Purple/Violet
        '#FF6347', // Tomato/Orange-Red
        '#40E0D0', // Turquoise/Cyan
        '#4169E1', // Royal Blue
        '#FF69B4', // Hot Pink
        '#32CD32', // Lime Green
        '#FF4500', // Orange Red
        '#8B4513', // Saddle Brown
        '#708090'  // Slate Grey
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'rgba(76, 175, 80, 0.8)'; // Green
      case 'PLANNED': return 'rgba(255, 193, 7, 0.8)';   // Yellow
      case 'ACTIVE': return 'rgba(33, 150, 243, 0.8)';   // Blue
      default: return 'rgba(158, 158, 158, 0.8)';        // Grey
    }
  };

  // Schemes HOD wise - Combined Bar and Line Chart Data
  const filteredSchemesData = getFilteredSchemesData();
  
  // When HOD is selected via chart filter, show scheme-wise data with status colors
  const isSchemeWiseView = chartFilters.schemes.hod_id && schemesDetails.length > 0;
  
  const schemesHODBarLineData = isSchemeWiseView ? {
    labels: schemesDetails.map(item => item.name?.split(' ').slice(0, 3).join(' ') || 'Unknown'),
    datasets: [
      {
        type: 'bar',
        label: 'Scheme Budget',
        data: schemesDetails.map(item => (item.total_budget || 0) / 100000), // In Lakhs
        backgroundColor: schemesDetails.map(item => getStatusColor(item.status)),
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'line',
        label: 'Utilized Budget (L)',
        data: schemesDetails.map(item => (item.budget_utilized || 0) / 100000),
        borderColor: '#FF5722',
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#FF5722',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
        order: 1
      }
    ]
  } : {
    labels: filteredSchemesData.map(item => item.hod_name?.split(' ').slice(0, 2).join(' ') || 'Unknown'),
    datasets: [
      {
        type: 'bar',
        label: 'Scheme Count',
        data: filteredSchemesData.map(item => item.scheme_count || 0),
        backgroundColor: [
          'rgba(21, 101, 192, 0.8)',
          'rgba(46, 125, 50, 0.8)',
          'rgba(239, 108, 0, 0.8)',
          'rgba(123, 31, 162, 0.8)',
          'rgba(198, 40, 40, 0.8)',
          'rgba(0, 131, 143, 0.8)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(233, 30, 99, 0.8)'
        ],
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'line',
        label: 'Budget Trend (Cr)',
        data: filteredSchemesData.map(item => (item.total_budget || 0) / 10000000),
        borderColor: '#FF5722',
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#FF5722',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
        order: 1
      }
    ]
  };

  const revenueChartData = {
    labels: revenueByDepartment.map(item => item.department),
    datasets: [{
      data: revenueByDepartment.map(item => item.total_revenue),
      backgroundColor: [
        '#FFD700', // Yellow/Gold
        '#9C27B0', // Purple
        '#FF9800', // Orange
        '#00BCD4', // Teal/Cyan
        '#2196F3', // Light Blue
        '#E91E63', // Pink
        '#4CAF50', // Green
        '#F44336', // Red
        '#795548', // Brown
        '#607D8B'  // Blue Grey
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8
    }]
  };

  // Calculate attendance totals for pie chart
  const attendanceTotals = attendanceByHOD.reduce((acc, item) => {
    acc.present += item.present || 0;
    acc.absent += item.absent || 0;
    acc.half_day += item.half_day || 0;
    acc.on_leave += item.on_leave || 0;
    return acc;
  }, { present: 0, absent: 0, half_day: 0, on_leave: 0 });

  const attendanceChartData = {
    labels: ['Present', 'Absent', 'Half Day', 'On Leave'],
    datasets: [{
      data: [
        attendanceTotals.present,
        attendanceTotals.absent,
        attendanceTotals.half_day,
        attendanceTotals.on_leave
      ],
      // backgroundColor: [
      //   '#4CAF50', // Green for present
      //   '#F44336', // Red for absent
      //   '#FF9800', // Orange for half day
      //   '#2196F3'  // Blue for on leave
      // ],
      distance:30,
      connectedWidth:1,
      connectorColor: '#555',

      // borderWidth: 3,
      // borderColor: '#ffffff',
      // hoverOffset: 8
    }]
  };

  const handleChartClick = async (chartType, clickedItem) => {
    try {
      let items = [];
      let columns = [];
      let title = '';

      if (chartType === 'hodsByDepartment') {
        // Get HODs by department
        const allHODs = await getHODs();
        const matchingHODs = allHODs.data.filter(h => h.department === clickedItem);
        items = matchingHODs.map(hod => ({
          name: hod.name,
          department: hod.department,
          email: hod.email,
          phone: hod.phone,
          status: hod.status
        }));
        title = `HODs - ${clickedItem}`;
        columns = [
          { key: 'name', label: 'HOD Name' },
          { key: 'department', label: 'Department' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'status', label: 'Status' }
        ];
      } else if (chartType === 'schemesByCategory') {
        // Get schemes by category - show HODs with schemes in this category
        const allSchemes = await getSchemesByHOD();
        items = allSchemes.data || [];
        title = `HODs with Schemes - ${clickedItem}`;
        columns = [
          { key: 'hod_name', label: 'HOD Name' },
          { key: 'department', label: 'Department' },
          { key: 'scheme_count', label: 'Schemes' },
          { key: 'total_budget', label: 'Total Budget' }
        ];
      } else if (chartType === 'budgetByHOD') {
        // Get HOD details - show all HODs in this department
        const hodData = budgetByHOD.find(h => h.department === clickedItem);
        if (hodData) {
          const allHODs = await getHODs();
          const matchingHODs = allHODs.data.filter(h => h.department === clickedItem);
          items = matchingHODs.map(hod => ({
            name: hod.name,
            department: hod.department,
            email: hod.email,
            phone: hod.phone,
            status: hod.status
          }));
          title = `HODs - ${clickedItem}`;
          columns = [
            { key: 'name', label: 'HOD Name' },
            { key: 'department', label: 'Department' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' }
          ];
        }
      } else if (chartType === 'revenueByDepartment') {
        // Get revenue by department - show HODs in this department
        const deptData = revenueByDepartment.find(d => d.department === clickedItem);
        if (deptData) {
          const allHODs = await getHODs();
          const matchingHODs = allHODs.data.filter(h => h.department === clickedItem);
          items = matchingHODs.map(hod => ({
            name: hod.name,
            department: hod.department,
            email: hod.email,
            phone: hod.phone
          }));
          title = `HODs in ${clickedItem} Department`;
          columns = [
            { key: 'name', label: 'HOD Name' },
            { key: 'department', label: 'Department' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' }
          ];
        }
      } else if (chartType === 'revenueByHOD') {
        // Get HOD revenue details
        const hodData = revenueByHOD.find(h => h.hod_name === clickedItem);
        if (hodData) {
          const allHODs = await getHODs();
          const hod = allHODs.data.find(h => h.name === clickedItem);
          if (hod) {
            items = [{ ...hodData, department: hod.department }];
            title = `Revenue Details - ${clickedItem}`;
            columns = [
              { key: 'hod_name', label: 'HOD Name' },
              { key: 'department', label: 'Department' },
              { key: 'total_revenue', label: 'Revenue' }
            ];
          }
        }
      } else if (chartType === 'attendanceByHOD') {
        // Get attendance details for HOD
        const hodData = attendanceByHOD.find(h => h.hod_name === clickedItem);
        if (hodData) {
          items = [hodData];
          title = `Attendance Details - ${clickedItem}`;
          columns = [
            { key: 'hod_name', label: 'HOD Name' },
            { key: 'department', label: 'Department' },
            { key: 'present', label: 'Present' },
            { key: 'absent', label: 'Absent' },
            { key: 'half_day', label: 'Half Day' },
            { key: 'on_leave', label: 'On Leave' }
          ];
        }
      } else if (chartType === 'attendanceByStatus') {
        // Get attendance list by status (Present, Absent, Half Day, Late, Leave)
        const statusMap = {
          'Present': 'present',
          'Absent': 'absent',
          'Half Day': 'half_day',
          'Late': 'late',
          'Leave': 'on_leave'
        };
        const statusKey = statusMap[clickedItem] || clickedItem.toLowerCase();
        
        try {
          const attendanceResponse = await getAttendance();
          const allAttendance = attendanceResponse.data || [];
          
          // Filter by status
          const filteredAttendance = allAttendance.filter(item => {
            if (clickedItem === 'Present') return item.status === 'present';
            if (clickedItem === 'Absent') return item.status === 'absent';
            if (clickedItem === 'Half Day') return item.status === 'half_day';
            if (clickedItem === 'Late') return item.status === 'late';
            if (clickedItem === 'Leave') return item.status === 'on_leave' || item.status === 'leave';
            return false;
          });
          
          items = filteredAttendance.map(item => ({
            staff_name: item.staff_name || item.name || 'Unknown',
            department: item.department || '-',
            date: item.date ? new Date(item.date).toLocaleDateString() : '-',
            check_in: item.check_in || '-',
            check_out: item.check_out || '-',
            status: item.status || clickedItem
          }));
          
          title = `${clickedItem} Staff List (${items.length})`;
          columns = [
            { key: 'staff_name', label: 'Staff Name' },
            { key: 'department', label: 'Department' },
            { key: 'date', label: 'Date' },
            { key: 'check_in', label: 'Check In' },
            { key: 'check_out', label: 'Check Out' }
          ];
        } catch (err) {
          console.error('Error fetching attendance by status:', err);
          items = [];
        }
      }

      if (items.length > 0) {
        setModalData({ title, items, columns });
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching chart details:', error);
      alert('Error loading details. Please try again.');
    }
  };

  const formatModalItem = (item, key) => {
    if (key === 'total_budget' || key === 'total_revenue' || key === 'allocated' || key === 'utilized') {
      return formatCurrency(item[key]);
    }
    return item[key] || '-';
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 13,
            weight: '600',
            family: "'Roboto', sans-serif"
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text: `${label} - ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor || '#ffffff',
                  lineWidth: data.datasets[0].borderWidth || 0,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const chart = event.chart;
        const index = element.index;
        const department = hodsByDepartment[index]?.category;
        if (department) {
          handleChartClick('hodsByDepartment', department);
        }
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              if (context.dataset.label === 'Allocated' || context.dataset.label === 'Utilized') {
                label += formatCurrency(context.parsed.y * 10000000);
              } else {
                label += formatCurrency(context.parsed);
              }
            }
            return label;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const chart = event.chart;
        const label = chart.data.labels[element.index];
        handleChartClick('schemesByCategory', label);
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Allocated' || context.dataset.label === 'Utilized') {
                label += formatCurrency(context.parsed.y * 10000000);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const chart = event.chart;
        const label = chart.data.labels[element.index];
        handleChartClick('budgetByHOD', label);
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        title: {
          display: true,
          text: 'Amount (Cr)',
          font: { size: 11 }
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value * 10000000);
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Schemes Bar + Line Chart Options
  const schemesBarLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.type === 'line') {
              label += formatCurrency(context.parsed.y * 10000000);
            } else {
              label += context.parsed.y + ' schemes';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Scheme Count',
          font: { size: 11, weight: '600' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)'
        },
        ticks: {
          stepSize: 1
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Budget (Cr)',
          font: { size: 11, weight: '600' }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return '₹' + value + 'Cr';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // HOD Revenue Pie Chart Options with outside labels like the reference image
  const hodRevenuePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 50,
        bottom: 50,
        left: 80,
        right: 80
      }
    },
    plugins: {
      legend: {
        display: false // Hide legend since we're showing labels outside
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `Revenue: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#333',
        font: {
          size: 11,
          weight: '600',
          family: "'Segoe UI', sans-serif"
        },
        anchor: 'end',
        align: 'end',
        offset: 10,
        formatter: function(value, context) {
          // Only return the label (department + formatted amount), not the raw value
          const label = context.chart.data.labels[context.dataIndex];
          // Truncate long department names if needed
          if (label && label.length > 18) {
            const parts = label.split(' (');
            if (parts.length === 2) {
              const name = parts[0].substring(0, 10) + '...';
              return name + ' (' + parts[1];
            }
          }
          return label || '';
        },
        display: function(context) {
          // Only show labels for slices with data
          return context.dataset.data[context.dataIndex] > 0;
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        const hodName = revenueByHOD[index]?.hod_name;
        if (hodName) {
          handleChartClick('revenueByHOD', hodName);
        }
      }
    }
  };

  // Attendance Pie Chart Options with outside labels and callout lines
  const attendancePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 60,
        bottom: 60,
        left: 100,
        right: 100
      }
    },
    plugins: {
      legend: {
        display: false // Hide legend since we're showing labels outside
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `Count: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: function(context) {
          return context.dataset.backgroundColor[context.dataIndex];
        },
        font: {
          size: 14,
          weight: '600',
          family: "'Segoe UI', sans-serif"
        },
        anchor: 'end',
        align: 'end',
        offset: 35,
        clamp: true,
        formatter: function(value, context) {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label} (${value})`;
        },
        display: function(context) {
          return context.dataset.data[context.dataIndex] > 0;
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0 // Flat pie chart without borders
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        const statusLabels = ['Present', 'Absent', 'Half Day', 'Late', 'Leave'];
        const clickedStatus = statusLabels[index];
        if (clickedStatus) {
          handleChartClick('attendanceByStatus', clickedStatus);
        }
      }
    }
  };

  // Custom plugin to draw connector lines for attendance pie chart
  const connectorLinesPlugin = {
    id: 'connectorLines',
    afterDraw: function(chart) {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      
      if (!meta || !meta.data) return;
      
      meta.data.forEach((arc, index) => {
        if (chart.data.datasets[0].data[index] <= 0) return;
        
        const centerX = arc.x;
        const centerY = arc.y;
        const outerRadius = arc.outerRadius;
        const startAngle = arc.startAngle;
        const endAngle = arc.endAngle;
        const middleAngle = (startAngle + endAngle) / 2;
        
        // Calculate points for the connector line - start from edge of pie
        const innerPointX = centerX + Math.cos(middleAngle) * outerRadius;
        const innerPointY = centerY + Math.sin(middleAngle) * outerRadius;
        
        // Extend line further out (outerRadius + 30)
        const outerPointX = centerX + Math.cos(middleAngle) * (outerRadius + 30);
        const outerPointY = centerY + Math.sin(middleAngle) * (outerRadius + 30);
        
        // Get color from dataset
        const color = chart.data.datasets[0].backgroundColor[index];
        
        // Draw the connector line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(innerPointX, innerPointY);
        ctx.lineTo(outerPointX, outerPointY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw small arrow/dot at the end
        ctx.beginPath();
        ctx.arc(outerPointX, outerPointY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      });
    }
  };

  const revenueChartOptions = {
    ...pieChartOptions,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const chart = event.chart;
        const index = element.index;
        const department = revenueByDepartment[index]?.department;
        if (department) {
          handleChartClick('revenueByDepartment', department);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* <Header 
        title="Dashboard" 
        subtitle="Welcome to HOD Management System" 
        onRefresh={handleRefresh}
        onExport={handleExport}
      /> */}

      {/* Filter Bar - Commented out
      <div className="filter-bar">
        <div className="filter-item">
          <label>HOD</label>
          <select 
            value={selectedHOD} 
            onChange={(e) => {
              setSelectedHOD(e.target.value);
              setFilters({ ...filters, hod_id: e.target.value });
            }}
          >
            <option value="">All HODs</option>
            {allHODs.map(hod => (
              <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Year</label>
          <select value={filters.year} onChange={(e) => { const nf = {...filters, year: e.target.value}; setFilters(nf); fetchDashboardData(nf); }}>
            <option>All</option>
            <option>2023</option>
            <option>2024</option>
            <option>2025</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Month</label>
          <select value={filters.month} onChange={(e) => { const nf = {...filters, month: e.target.value}; setFilters(nf); }}>
            <option>All</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Date</label>
          <input type="date" value={filters.date} onChange={(e) => { const nf = {...filters, date: e.target.value}; setFilters(nf); }} />
        </div>
        <div className="filter-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => { 
            setSelectedHOD('');
            setSelectedHODTable({ schemes: '', budget: '', attendance: '' });
            setFilters({ year: 'All', month: 'All', date: '', hod_id: '' }); 
            fetchDashboardData({ year: 'All', month: 'All', date: '', hod_id: '' });
            setSchemesDetails([]);
            setBudgetDetails([]);
            setAttendanceDetails([]);
          }}>Clear</button>
          <button className="btn btn-primary btn-sm" onClick={() => fetchDashboardData()}>Apply</button>
        </div>
      </div>
      */}

      {/* Hero Stats (top big cards like reference) */}
      {/* <div className="hero-stats">
        <div className="hero-card">
          <div className="hero-number purple">{formatCompactNumber(stats.totalHods)}</div>
          <div className="hero-label">HODs</div>
        </div>
        <div className="hero-card">
          <div className="hero-number green">{formatCompactNumber(quickStats.districtsCovered)}</div>
          <div className="hero-label">District</div>
        </div>
        <div className="hero-card">
          <div className="hero-number red">{formatCompactNumber(quickStats.beneficiaries)}</div>
          <div className="hero-label">Total Farmers</div>
        </div>
        <div className="hero-card">
          <div className="hero-number purple">{formatCurrency(stats.totalBudget)}</div>
          <div className="hero-label">Total Budget</div>
        </div>
        <div className="hero-card">
          <div className="hero-number blue">{formatCompactNumber(stats.totalSchemes)}</div>
          <div className="hero-label">Nursery</div>
        </div>
        <div className="hero-card">
          <div className="hero-number teal">{formatCompactNumber(quickStats.nodalOfficers)}</div>
          <div className="hero-label">Nodal Officers</div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalHods}</h3>
            <p>Total HODs</p>
            <div className="trend up">
              {/* <FiTrendingUp /> +2 this month */}
            </div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">
            <FiFileText />
          </div>
          <div className="stat-info">
            <h3>{stats.totalSchemes}</h3>
            <p>Active Schemes</p>
            <div className="trend up">
              {/* <FiTrendingUp /> +3 new schemes */}
            </div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">
            <FiActivity />
          </div>
          <div className="stat-info">
            <h3>{stats.totalStaff}</h3>
            <p>Total Staff</p>
            <div className="trend up">
              {/* <FiTrendingUp /> Active employees */}
            </div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalBudget)}</h3>
            <p>Total Budget</p>
            <div className="trend up">
              {/* <FiTrendingUp /> FY 2024-25 */}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <h4>{formatCurrency(quickStats.utilizedBudget)}</h4>
          <p>Budget Utilized ({quickStats.budgetUtilization}%)</p>
          <div className="trend up" style={{ fontSize: '12px', color: 'var(--accent-color)', marginTop: '4px' }}>
            <FiTrendingUp style={{ marginRight: '4px' }} /> {quickStats.budgetUtilization}% utilized
          </div>
        </div>
        <div className="quick-stat">
          <h4>{formatCurrency(quickStats.remainingBudget)}</h4>
          <p>Remaining Budget</p>
        </div>
        <div className="quick-stat">
          <h4>{quickStats.districtsCovered}</h4>
          <p>Districts Covered</p>
        </div>
        <div className="quick-stat">
          <h4>{formatBeneficiaries(quickStats.beneficiaries)}</h4>
          <p>Beneficiaries</p>
        </div>
        {/* <div className="quick-stat">
          <h4>{quickStats.attendanceRate}%</h4>
          <p>Attendance Rate</p>
        </div> */}
        <div className="quick-stat">
          <h4>{quickStats.nodalOfficers}</h4>
          <p>Nodal Officers</p>
        </div>
      </div>
      {/* Charts - 2x2 Grid Layout */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Chart 1: HOD Revenue - Pie Chart with legend on right */}
        <div className="chart-card">
          <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><FiPieChart /> HOD Revenue {chartFilters.revenue.hod_id && <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>({allHODs.find(h => h.id === parseInt(chartFilters.revenue.hod_id))?.name})</span>}</h3>
            <div className="chart-filter-container" style={{ position: 'relative' }}>
              <FiFilter 
                style={{ cursor: 'pointer', color: chartFilters.revenue.hod_id ? '#2e7d32' : '#666', fontSize: '18px' }} 
                title="Filter" 
                onClick={(e) => { e.stopPropagation(); toggleFilterDropdown('revenue'); }}
              />
              {renderFilterDropdown('revenue')}
            </div>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer', height: '300px' }}>
              <Pie data={hodRevenueChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Chart 2: Schemes (HOD wise) - Bar + Line Combined Chart */}
        <div className="chart-card">
          <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h3><FiBarChart2 /> {isSchemeWiseView ? 'Schemes (Scheme wise)' : 'Schemes (HOD wise)'} {chartFilters.schemes.hod_id && <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>({allHODs.find(h => h.id === parseInt(chartFilters.schemes.hod_id))?.name})</span>}</h3>
              {isSchemeWiseView && (
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(76, 175, 80, 0.8)' }}></span> Completed
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(255, 193, 7, 0.8)' }}></span> Planned
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(33, 150, 243, 0.8)' }}></span> Active
                  </span>
                </div>
              )}
            </div>
            <div className="chart-filter-container" style={{ position: 'relative' }}>
              <FiFilter 
                style={{ cursor: 'pointer', color: chartFilters.schemes.hod_id ? '#2e7d32' : '#666', fontSize: '18px' }} 
                title="Filter" 
                onClick={(e) => { e.stopPropagation(); toggleFilterDropdown('schemes'); }}
              />
              {renderFilterDropdown('schemes')}
            </div>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer', height: '300px' }}>
              <Bar data={schemesHODBarLineData} options={schemesBarLineOptions} />
            </div>
          </div>
        </div>

        {/* Chart 3: Budget (HOD wise) */}
        <div className="chart-card">
          <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><FiPieChart /> Budget (HOD wise) {chartFilters.budget.hod_id && <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>({allHODs.find(h => h.id === parseInt(chartFilters.budget.hod_id))?.name})</span>}</h3>
            <div className="chart-filter-container" style={{ position: 'relative' }}>
              <FiFilter 
                style={{ cursor: 'pointer', color: chartFilters.budget.hod_id ? '#2e7d32' : '#666', fontSize: '18px' }} 
                title="Filter" 
                onClick={(e) => { e.stopPropagation(); toggleFilterDropdown('budget'); }}
              />
              {renderFilterDropdown('budget')}
            </div>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer', height: '300px' }}>
              <Pie data={budgetHODPieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Chart 4: Attendance (HOD wise) - Pie Chart with outside labels */}
        <div className="chart-card">
          <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><FiPieChart /> Attendance (HOD wise) {chartFilters.attendance.hod_id && <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>({allHODs.find(h => h.id === parseInt(chartFilters.attendance.hod_id))?.name})</span>}</h3>
            <div className="chart-filter-container" style={{ position: 'relative' }}>
              <FiFilter 
                style={{ cursor: 'pointer', color: chartFilters.attendance.hod_id ? '#2e7d32' : '#666', fontSize: '18px' }} 
                title="Filter" 
                onClick={(e) => { e.stopPropagation(); toggleFilterDropdown('attendance'); }}
              />
              {renderFilterDropdown('attendance')}
            </div>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer', height: '390px' }}>
              <Pie data={attendanceHODPieChartData} options={attendancePieOptions} plugins={[ChartDataLabels, connectorLinesPlugin]} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      {/* HOD Revenue Table */}
      <div className="table-card">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Revenue {selectedHOD || selectedHODTable.revenue ? `(${allHODs.find(h => h.id === parseInt(selectedHODTable.revenue || selectedHOD))?.name || 'Selected HOD'})` : '(HOD Wise)'}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={selectedHODTable.revenue || selectedHOD || ''} 
              onChange={(e) => {
                const hodId = e.target.value;
                setSelectedHODTable({ ...selectedHODTable, revenue: hodId });
                if (hodId) {
                  getRevenueByHODId(hodId).then(res => setRevenueDetails(res.data || []));
                } else {
                  setRevenueDetails([]);
                }
              }}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All HODs</option>
              {allHODs.map(hod => (
                <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {(selectedHOD || selectedHODTable.revenue) ? (
                  <>
                    <th>Scheme Name</th>
                    <th>Source</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </>
                ) : (
                  <>
                    <th>HOD Name</th>
                    <th>Department</th>
                    <th>Total Revenue</th>
                    <th>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(selectedHOD || selectedHODTable.revenue) && revenueDetails.length > 0 ? (
                revenueDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.scheme_name || '-'}</td>
                    <td>{item.source || '-'}</td>
                    <td>{item.category || '-'}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              ) : (selectedHOD || selectedHODTable.revenue) ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No revenue data found for selected HOD</td></tr>
              ) : revenueByHOD.length > 0 ? (
                revenueByHOD.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hod_name}</td>
                    <td>{item.department || '-'}</td>
                    <td>{formatCurrency(item.total_revenue)}</td>
                    <td><span className="status-badge active">Active</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No revenue data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Schemes {selectedHOD ? `(${allHODs.find(h => h.id === parseInt(selectedHOD))?.name || 'Selected HOD'})` : '(HOD Wise)'}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={selectedHODTable.schemes || selectedHOD || ''} 
              onChange={(e) => {
                const hodId = e.target.value;
                setSelectedHODTable({ ...selectedHODTable, schemes: hodId });
                if (hodId) {
                  getSchemesByHODId(hodId).then(res => setSchemesDetails(res.data || []));
                } else {
                  setSchemesDetails([]);
                }
              }}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All HODs</option>
              {allHODs.map(hod => (
                <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {selectedHOD || selectedHODTable.schemes ? (
                  <>
                    <th>Scheme Name</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Utilized Budget</th>
                    <th>Remaining Budget</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>HOD Name</th>
                    <th>Total Schemes</th>
                    <th>Total Budget</th>
                    <th>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(selectedHOD || selectedHODTable.schemes) && schemesDetails.length > 0 ? (
                schemesDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.scheme_category}</td>
                    <td>{formatCurrency(item.total_budget)}</td>
                    <td>{formatCurrency(item.budget_utilized || 0)}</td>
                    <td>{formatCurrency((item.total_budget || 0) - (item.budget_utilized || 0))}</td>
                    <td><span className={`status-badge ${item.status?.toLowerCase() || 'active'}`}>{item.status || 'Active'}</span></td>
                  </tr>
                ))
              ) : selectedHOD || selectedHODTable.schemes ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No schemes found for selected HOD</td></tr>
              ) : (
                schemesByHOD.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hod_name}</td>
                    <td>{item.scheme_count}</td>
                    <td>{formatCurrency(item.total_budget)}</td>
                    <td><span className="status-badge active">Active</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Budget {selectedHOD ? `(${allHODs.find(h => h.id === parseInt(selectedHOD))?.name || 'Selected HOD'})` : '(HOD Wise)'}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={selectedHODTable.budget || selectedHOD || ''} 
              onChange={(e) => {
                const hodId = e.target.value;
                setSelectedHODTable({ ...selectedHODTable, budget: hodId });
                if (hodId) {
                  getBudgetByHODId(hodId).then(res => setBudgetDetails(res.data || []));
                } else {
                  setBudgetDetails([]);
                }
              }}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All HODs</option>
              {allHODs.map(hod => (
                <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {(selectedHOD || selectedHODTable.budget) ? (
                  <>
                    <th>Scheme</th>
                    <th>Allocated</th>
                    <th>Utilized</th>
                    <th>Financial Year</th>
                    <th>Utilization %</th>
                  </>
                ) : (
                  <>
                    <th>HOD</th>
                    <th>Department</th>
                    <th>Allocated</th>
                    <th>Utilized</th>
                    <th>Utilization %</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(selectedHOD || selectedHODTable.budget) && budgetDetails.length > 0 ? (
                budgetDetails.map((item, index) => {
                  const utilization = item.allocated_amount > 0 ? ((item.utilized_amount / item.allocated_amount) * 100) : 0;
                  return (
                    <tr key={index}>
                      <td>{item.scheme_name}</td>
                      <td>{formatCurrency(item.allocated_amount)}</td>
                      <td>{formatCurrency(item.utilized_amount)}</td>
                      <td>{item.financial_year}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-bar" style={{ width: '100px' }}>
                            <div 
                              className="progress-fill blue" 
                              style={{ width: `${utilization}%` }}
                            ></div>
                          </div>
                          <span>{utilization.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (selectedHOD || selectedHODTable.budget) ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No budget data found for selected HOD</td></tr>
              ) : (
                budgetByHOD.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hod_name}</td>
                    <td>{item.department}</td>
                    <td>{formatCurrency(item.allocated)}</td>
                    <td>{formatCurrency(item.utilized)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '100px' }}>
                          <div 
                            className="progress-fill blue" 
                            style={{ width: `${(item.utilized / item.allocated) * 100}%` }}
                          ></div>
                        </div>
                        <span>{((item.utilized / item.allocated) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Attendance Summary {selectedHOD ? `(${allHODs.find(h => h.id === parseInt(selectedHOD))?.name || 'Selected HOD'})` : '(HOD Wise)'}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={selectedHODTable.attendance || selectedHOD || ''} 
              onChange={(e) => {
                const hodId = e.target.value;
                setSelectedHODTable({ ...selectedHODTable, attendance: hodId });
                if (hodId) {
                  getAttendanceByHODId(hodId).then(res => setAttendanceDetails(res.data || []));
                } else {
                  setAttendanceDetails([]);
                }
              }}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All HODs</option>
              {allHODs.map(hod => (
                <option key={hod.id} value={hod.id}>{hod.name} - {hod.department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {(selectedHOD || selectedHODTable.attendance) ? (
                  <>
                    <th>Staff Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </>
                ) : (
                  <>
                    <th>Department</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Half Day</th>
                    <th>On Leave</th>
                    <th>Attendance %</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(selectedHOD || selectedHODTable.attendance) && attendanceDetails.length > 0 ? (
                attendanceDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.staff_name}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={`status-badge ${item.status === 'present' ? 'active' : item.status === 'absent' ? 'inactive' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.check_in || '-'}</td>
                    <td>{item.check_out || '-'}</td>
                  </tr>
                ))
              ) : (selectedHOD || selectedHODTable.attendance) ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No attendance data found for selected HOD</td></tr>
              ) : (
                attendanceByHOD.map((item, index) => {
                  const total = item.present + item.absent + item.half_day + (item.on_leave || 0);
                  const percentage = total > 0 ? ((item.present / total) * 100).toFixed(1) : 0;
                  return (
                    <tr key={index}>
                      <td>{item.hod_name}</td>
                      <td><span style={{ color: 'var(--accent-color)' }}>{item.present}</span></td>
                      <td><span style={{ color: 'var(--danger-color)' }}>{item.absent}</span></td>
                      <td><span style={{ color: 'var(--warning-color)' }}>{item.half_day}</span></td>
                      <td>{item.on_leave || 0}</td>
                      <td>
                        <span className={`status-badge ${percentage >= 80 ? 'active' : percentage >= 60 ? 'pending' : 'inactive'}`}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        items={modalData.items}
        columns={modalData.columns}
        formatItem={formatModalItem}
      />
    </div>
  );
};

export default Dashboard;
