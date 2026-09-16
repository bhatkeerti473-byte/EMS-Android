  const [booking, setBooking] = React.useState(null);
  const [staffList, setStaffList] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [selectedStaffType, setSelectedStaffType] = React.useState('Event Manager');
  
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [assigningStaff, setAssigningStaff] = React.useState(null);
  
  const [assignForm, setAssignForm] = React.useState({
    reportingDate: '',
    reportingTime: '10:00 AM',
    responsibilities: ''
  });

  React.useEffect(() => {
    fetch(http://localhost:5000/api/bookings/${bookingId})
      .then(r => r.json())
      .then(data => { if(data.success) setBooking(data.data); })
      .catch(e => console.log(e));
    
    fetch('http://localhost:5000/api/staff')
      .then(r => r.json())
      .then(data => { if(data.success) setStaffList(data.data); })
      .catch(e => console.log(e));
      
    fetchAssignments();
  }, [bookingId]);

  const fetchAssignments = () => {
    fetch(http://localhost:5000/api/event-staff-assignments/booking/${bookingId})
      .then(r => r.json())
      .then(data => { if(data.success) setAssignments(data.data); })
      .catch(e => console.log(e));
  };

  const handleOpenAssignModal = (staff) => {
    setAssigningStaff(staff);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if(!assignForm.reportingDate) return alert('Enter Reporting Date');
    try {
      const res = await fetch('http://localhost:5000/api/event-staff-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: assigningStaff._id,
          bookingId: bookingId,
          role: assigningStaff.role,
          reportingDate: assignForm.reportingDate,
          reportingTime: assignForm.reportingTime,
          eventDate: booking?.eventDate || new Date().toISOString().split('T')[0],
          venueName: booking?.venueName || 'N/A',
          location: 'Udupi', // default fallback
          responsibilities: [assignForm.responsibilities],
        })
      });
      const data = await res.json();
      if(data.success) {
        alert("Staff Assigned & Notification Sent!");
        setIsAssignModalOpen(false);
        fetchAssignments();
      }
    } catch(err) {
      console.error(err);
      alert("Failed to assign staff");
    }
  };

  const staffTypes = [
    { id: 'Security Staff', label: 'Security', icon: Users },
    { id: 'Event Manager', label: 'Event Manager', icon: User },
    { id: 'Coordinator', label: 'Coordinator', icon: Users },
    { id: 'Catering Staff', label: 'Catering', icon: Utensils },
    { id: 'Decorator', label: 'Decorator', icon: Flower2 },
  ];
