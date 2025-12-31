import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ListModal from '../components/ListModal';
import { Pie, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FiUsers, FiFileText, FiDollarSign, FiTrendingUp, FiActivity, FiPieChart, FiBarChart2 } from 'react-icons/fi';
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
  getAttendanceByHODId
} from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  const [selectedHODTable, setSelectedHODTable] = useState({ schemes: '', budget: '', attendance: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ year: 'All', month: 'All', date: '', hod_id: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', items: [], columns: [] });
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
      backgroundColor: [
        '#4CAF50', // Green for present
        '#F44336', // Red for absent
        '#FF9800', // Orange for half day
        '#2196F3'  // Blue for on leave
      ],
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverOffset: 8
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
                  text: `${label} (${value}) - ${percentage}%`,
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
      <Header 
        title="Dashboard" 
        subtitle="Welcome to HOD Management System" 
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Filter Bar */}
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
          <h4>{quickStats.budgetUtilization}%</h4>
          <p>Budget Utilized</p>
        </div>
        <div className="quick-stat">
          <h4>{quickStats.districtsCovered}</h4>
          <p>Districts Covered</p>
        </div>
        <div className="quick-stat">
          <h4>{formatBeneficiaries(quickStats.beneficiaries)}</h4>
          <p>Beneficiaries</p>
        </div>
        <div className="quick-stat">
          <h4>{quickStats.attendanceRate}%</h4>
          <p>Attendance Rate</p>
        </div>
        <div className="quick-stat">
          <h4>{quickStats.nodalOfficers}</h4>
          <p>Nodal Officers</p>
        </div>
      </div>
      {/* Widget Cards */}
      <div className="data-cards-grid">
        <div className="data-card">
          <div className="data-card-header">
            <h4><FiUsers style={{ color: '#1565c0' }} /> HODs Summary</h4>
          </div>
          <div className="data-card-body">
            {budgetByHOD.slice(0, 4).map((hod, index) => (
              <div className="data-card-item" key={index}>
                <div className="data-card-item-left">
                  <div className="data-card-item-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                    <FiUsers />
                  </div>
                  <div className="data-card-item-info">
                    <h5>{hod.department}</h5>
                    <span>{hod.hod_name}</span>
                  </div>
                </div>
                <div className="data-card-item-value">{formatCurrency(hod.allocated)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="data-card">
          <div className="data-card-header">
            <h4><FiFileText style={{ color: '#2e7d32' }} /> Schemes Overview</h4>
          </div>
          <div className="data-card-body">
            {schemesByHOD.slice(0, 4).map((item, index) => (
              <div className="data-card-item" key={index}>
                <div className="data-card-item-left">
                  <div className="data-card-item-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                    <FiFileText />
                  </div>
                  <div className="data-card-item-info">
                    <h5>{item.hod_name}</h5>
                    <span>{item.scheme_count} Schemes</span>
                  </div>
                </div>
                <div className="data-card-item-value">{formatCurrency(item.total_budget)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="data-card">
          <div className="data-card-header">
            <h4><FiDollarSign style={{ color: '#ef6c00' }} /> Budget Status</h4>
          </div>
          <div className="data-card-body">
            <div className="data-card-item">
              <div className="data-card-item-left">
                <div className="data-card-item-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                  <FiDollarSign />
                </div>
                <div className="data-card-item-info">
                  <h5>Total Allocated</h5>
                  <span>FY 2024-25</span>
                </div>
              </div>
              <div className="data-card-item-value">{formatCurrency(stats.totalBudget)}</div>
            </div>
            <div className="data-card-item">
              <div className="data-card-item-left">
                <div className="data-card-item-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  <FiTrendingUp />
                </div>
                <div className="data-card-item-info">
                  <h5>Total Utilized</h5>
                  <span>{((stats.utilizedBudget / stats.totalBudget) * 100).toFixed(1)}% utilized</span>
                </div>
              </div>
              <div className="data-card-item-value">{formatCurrency(stats.utilizedBudget)}</div>
            </div>
            <div className="data-card-item">
              <div className="data-card-item-left">
                <div className="data-card-item-icon" style={{ background: '#fff3e0', color: '#ef6c00' }}>
                  <FiActivity />
                </div>
                <div className="data-card-item-info">
                  <h5>Remaining</h5>
                  <span>To be utilized</span>
                </div>
              </div>
              <div className="data-card-item-value">{formatCurrency(stats.totalBudget - stats.utilizedBudget)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3><FiPieChart /> HODs by Department</h3>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer' }}>
              <Pie data={hodsByDepartmentChartData} options={pieChartOptions} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Click on a segment to view HOD details
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3><FiBarChart2 /> Budget by Department (Cr)</h3>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer' }}>
              <Bar data={budgetHODChartData} options={barOptions} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Click on a bar to view HOD details
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3><FiPieChart /> Revenue by Department</h3>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer' }}>
              <Pie data={revenueChartData} options={pieChartOptions} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Click on a segment to view department details
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3><FiPieChart /> Attendance Overview</h3>
          </div>
          <div className="chart-card-body">
            <div className="chart-container" style={{ cursor: 'pointer' }}>
              <Pie data={attendanceChartData} options={pieChartOptions} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Overall attendance statistics
            </p>
          </div>
        </div>
      </div>

      {/* Tables */}
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
                    <td><span className={`status-badge ${item.status?.toLowerCase() || 'active'}`}>{item.status || 'Active'}</span></td>
                  </tr>
                ))
              ) : selectedHOD || selectedHODTable.schemes ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No schemes found for selected HOD</td></tr>
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
