import React, { useState, useEffect } from 'react';
import { Tractor, Mail, Lock, Eye, EyeOff, ArrowRight, User, Search, MapPin, DollarSign, Star, Zap, BarChart3, Activity, AlertCircle, Users, Clock, Server, Database, AlertTriangle, XCircle, RefreshCw, LogOut, CreditCard, Bell, Phone, Package, Download, CheckCircle, Sparkles, Calendar } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState('user');
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleLogin = (role, userData) => {
    setUserRole(role);
    setCurrentUser(userData);
    setCurrentView('main');

    if (role === 'user') {
      setBookings([
        { id: 1, machinery: 'John Deere 5075E', date: '2025-10-05', status: 'upcoming', price: 1200, duration: 3 },
        { id: 2, machinery: 'Combine Harvester', date: '2025-09-28', status: 'completed', price: 3500, duration: 5 },
      ]);

      setNotifications([
        { id: 1, message: 'Your booking starts in 2 days', type: 'info', time: '2 hours ago' },
      ]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBookings([]);
    setNotifications([]);
    setCurrentView('login');
  };

  const handleBooking = (machinery) => {
    const newBooking = {
      id: Date.now(),
      machinery: machinery.name,
      date: new Date().toISOString().split('T')[0],
      status: 'upcoming',
      price: machinery.price,
      duration: 3
    };
    setBookings([newBooking, ...bookings]);
    setNotifications([{
      id: Date.now(),
      message: `Booking confirmed for ${machinery.name}`,
      type: 'success',
      time: 'Just now'
    }, ...notifications]);
  };

  return (
    <div>
      {currentView === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentView === 'main' && (
        <MainApp
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentView('profile')}
          userRole={userRole}
          currentUser={currentUser}
          bookings={bookings}
          notifications={notifications}
          onBooking={handleBooking}
        />
      )}
      {currentView === 'profile' && (
        <UserProfile
          onBack={() => setCurrentView('main')}
          onLogout={handleLogout}
          currentUser={currentUser}
          bookings={bookings}
        />
      )}
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      const role = email.includes('admin') ? 'admin' : 'user';
      const userData = {
        name: email.split('@')[0],
        email,
        phone: '+91 9876543210',
        memberSince: '2024',
        totalBookings: 12
      };
      onLogin(role, userData);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tractor className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">AgriRent</h1>
          <p className="text-gray-600">Smart Machinery Rental</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Tip: Use admin@agrirent.com for admin</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!email || !password || isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : (
              <>
                Login
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MainApp = ({ onLogout, onNavigateToProfile, userRole, currentUser, bookings, notifications, onBooking }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [locationFilter, setLocationFilter] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);
  const [weatherData, setWeatherData] = useState(null);
  const [collectiveBookings, setCollectiveBookings] = useState([]);
  const [showCollectiveModal, setShowCollectiveModal] = useState(false);
  const [selectedCollective, setSelectedCollective] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [diseaseDetection, setDiseaseDetection] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Vegetables', 'Fruits'];
  const soilTypes = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil', 'Clay Soil', 'Sandy Soil'];

  const machinery = [
    { id: 1, name: 'John Deere 5075E', type: 'Tractor', power: '75 HP', price: 1200, rating: 4.8, image: '🚜', location: 'Devanahalli', address: 'Bangalore Rural', distance: 42, owner: 'Rajesh Kumar', phone: '+91 9876543210', suitable: ['Wheat', 'Rice', 'Cotton'], demand: 'high', soilSuitability: ['Red Soil', 'Black Soil', 'Alluvial Soil'] },
    { id: 2, name: 'Mahindra 575 DI', type: 'Tractor', power: '47 HP', price: 800, rating: 4.5, image: '🚜', location: 'Electronic City', address: 'Bangalore Urban', distance: 18, owner: 'Suresh Reddy', phone: '+91 9876543211', suitable: ['Vegetables', 'Fruits', 'Maize'], demand: 'medium', soilSuitability: ['Red Soil', 'Sandy Soil', 'Laterite Soil'] },
    { id: 3, name: 'Combine Harvester', type: 'Harvester', power: '200 HP', price: 3500, rating: 4.9, image: '🌾', location: 'Mysuru', address: 'Hinkal Road', distance: 145, owner: 'Venkatesh Gowda', phone: '+91 9876543212', suitable: ['Wheat', 'Rice', 'Maize'], demand: 'high', soilSuitability: ['Black Soil', 'Alluvial Soil'] },
    { id: 4, name: 'Rotavator Pro', type: 'Cultivator', power: '50 HP', price: 600, rating: 4.3, image: '⚙️', location: 'Kalaburagi', address: 'Jewargi Road', distance: 612, owner: 'Prakash Singh', phone: '+91 9876543213', suitable: ['Vegetables', 'Cotton', 'Sugarcane'], demand: 'low', soilSuitability: ['Clay Soil', 'Black Soil'] },
    { id: 5, name: 'Sprayer Elite 500', type: 'Sprayer', power: '25 HP', price: 350, rating: 4.7, image: '💧', location: 'Mangaluru', address: 'Bajpe', distance: 352, owner: 'Anand Kumar', phone: '+91 9876543214', suitable: ['Vegetables', 'Fruits', 'Cotton'], demand: 'high', soilSuitability: ['Red Soil', 'Laterite Soil', 'Sandy Soil'] },
    { id: 6, name: 'New Holland TD90', type: 'Tractor', power: '90 HP', price: 1500, rating: 4.9, image: '🚜', location: 'Tumakuru', address: 'Bangalore Road', distance: 70, owner: 'Krishna Murthy', phone: '+91 9876543215', suitable: ['Wheat', 'Cotton', 'Sugarcane'], demand: 'high', soilSuitability: ['Black Soil', 'Red Soil', 'Clay Soil'] },
    { id: 7, name: 'Seed Drill Master', type: 'Seeder', power: '35 HP', price: 450, rating: 4.6, image: '🌱', location: 'Bangalore North', address: 'Yelahanka', distance: 28, owner: 'Mahesh Patel', phone: '+91 9876543216', suitable: ['Wheat', 'Rice', 'Maize'], demand: 'medium', soilSuitability: ['Alluvial Soil', 'Red Soil'] },
  ];

  const calculateDynamicPrice = (basePrice, demand, farmSize) => {
    let multiplier = 1;
    if (demand === 'high') multiplier = 1.3;
    else if (demand === 'low') multiplier = 0.8;
    const sizeMultiplier = farmSize > 50 ? 0.9 : farmSize > 20 ? 1 : 1.1;
    return Math.round(basePrice * multiplier * sizeMultiplier);
  };

  const getMachineryRecommendations = () => {
    if (!selectedCrop || !farmSize) return;

    let suitable = machinery.filter(m => m.suitable.includes(selectedCrop));

    // If soil type selected, add soil compatibility bonus
    if (soilType) {
      suitable = suitable.filter(m => m.soilSuitability.includes(soilType));
    }

    const scored = suitable.map(m => {
      let score = m.rating * 20;

      // Demand factor
      score += m.demand === 'high' ? 10 : m.demand === 'medium' ? 5 : 0;

      // Distance bonus (proximity)
      score += m.distance <= 25 ? 15 : m.distance <= 50 ? 10 : 5;

      // Soil compatibility bonus
      if (soilType && m.soilSuitability.includes(soilType)) {
        score += 20;
      }

      // Weather factor (if rainy season, prioritize covered equipment)
      if (weatherData && weatherData.forecast.some(d => d.rainfall > 50)) {
        if (m.type === 'Sprayer') score += 15;
      }

      // Farm size optimization
      const farmSizeNum = parseFloat(farmSize);
      if (farmSizeNum > 50 && parseInt(m.power) > 70) score += 10;
      else if (farmSizeNum <= 20 && parseInt(m.power) < 50) score += 10;

      return {
        ...m,
        score,
        confidence: Math.min(95, Math.round(score * 0.85)),
        dynamicPrice: calculateDynamicPrice(m.price, m.demand, farmSizeNum),
        matchReasons: []
      };
    });

    // Add match reasons
    scored.forEach(m => {
      if (m.suitable.includes(selectedCrop)) m.matchReasons.push('Crop compatible');
      if (soilType && m.soilSuitability.includes(soilType)) m.matchReasons.push('Soil optimized');
      if (m.distance <= 50) m.matchReasons.push('Nearby location');
      if (m.rating >= 4.5) m.matchReasons.push('High rated');
      if (m.demand === 'high') m.matchReasons.push('Popular choice');
    });

    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, 3));
    setShowRecommendations(true);
  };

  // Simulate ML-based disease detection
  const analyzeCropDisease = (imageFile) => {
    setIsAnalyzing(true);

    // Simulate ML inference delay
    setTimeout(() => {
      // Simulated disease detection results
      const diseases = [
        {
          name: 'Leaf Blight',
          confidence: 89,
          severity: 'High',
          treatment: 'Fungicide application needed',
          recommendedEquipment: ['Sprayer Elite 500', 'Boom Sprayer'],
          urgency: 'high'
        },
        {
          name: 'Rust Disease',
          confidence: 76,
          severity: 'Medium',
          treatment: 'Preventive spraying recommended',
          recommendedEquipment: ['Sprayer Elite 500'],
          urgency: 'medium'
        },
        {
          name: 'Powdery Mildew',
          confidence: 65,
          severity: 'Low',
          treatment: 'Monitor and spray if spreading',
          recommendedEquipment: ['Sprayer Elite 500'],
          urgency: 'low'
        }
      ];

      const detected = diseases[Math.floor(Math.random() * diseases.length)];
      setDiseaseDetection(detected);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDiseaseImage(event.target.result);
        analyzeCropDisease(file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setWeatherData({
      current: { temp: 28, condition: 'Sunny' },
      forecast: [
        { day: 'Today', condition: 'Sunny', temp: 28, rainfall: 0, icon: '☀️', ideal: true },
        { day: 'Tomorrow', condition: 'Cloudy', temp: 27, rainfall: 10, icon: '⛅', ideal: true },
        { day: 'Day 3', condition: 'Heavy Rain', temp: 24, rainfall: 85, icon: '🌧️', ideal: false, alert: 'Not suitable for field work' },
        { day: 'Day 4', condition: 'Rain', temp: 23, rainfall: 60, icon: '🌦️', ideal: false },
        { day: 'Day 5', condition: 'Cloudy', temp: 26, rainfall: 20, icon: '☁️', ideal: true },
      ],
      recommendation: 'Book machinery today or tomorrow before heavy rain!',
      urgency: 'high'
    });

    setCollectiveBookings([
      {
        id: 1,
        machinery: 'Combine Harvester',
        machineryId: 3,
        location: 'Mysuru',
        distance: 145,
        originalPrice: 3500,
        sharedPrice: 1200,
        currentMembers: 2,
        requiredMembers: 3,
        savings: 2300,
        date: '2025-10-08',
        members: ['Manjunath K', 'Ravi Kumar'],
        timeLeft: '2 days'
      },
      {
        id: 2,
        machinery: 'John Deere 5075E',
        machineryId: 1,
        location: 'Devanahalli',
        distance: 42,
        originalPrice: 1200,
        sharedPrice: 600,
        currentMembers: 1,
        requiredMembers: 2,
        savings: 600,
        date: '2025-10-06',
        members: ['Rajesh Kumar'],
        timeLeft: '4 days'
      },
    ]);
  }, []);

  const handleRentClick = (machine) => {
    setSelectedMachinery(machine);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (selectedMachinery) {
      onBooking(selectedMachinery);
      setShowPaymentModal(false);
      setSelectedMachinery(null);
    }
  };

  const filteredMachinery = machinery.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.type === selectedCategory;
    const matchesLocation = locationFilter === 'all' ||
                          (locationFilter === 'nearby' && m.distance <= maxDistance);
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-xl">
                <Tractor className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AgriRent</h1>
                <p className="text-xs text-gray-500">Smart Machinery Rental</p>
              </div>
            </div>

            <nav className="flex gap-2 items-center">
              {['home', 'catalog', 'recommend', 'disease', 'weather'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl font-medium capitalize transition-all ${
                    activeTab === tab ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'disease' ? 'AI Scanner' : tab}
                </button>
              ))}

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 relative"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border p-4 z-50">
                    <h3 className="font-bold text-gray-800 mb-3">Notifications</h3>
                    <div className="space-y-2">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 rounded-xl border-2 border-blue-100 bg-blue-50">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onNavigateToProfile}
                className="px-5 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2"
              >
                <User size={18} />
                Profile
              </button>

              <button
                onClick={onLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <LogOut size={18} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {weatherData && weatherData.urgency === 'high' && (
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="text-6xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Weather Alert: Heavy Rain Expected!</h3>
                    <p className="text-lg mb-4">{weatherData.recommendation}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => setActiveTab('weather')}
                        className="border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all"
                      >
                        View Forecast
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-12 text-white">
              <h2 className="text-5xl font-bold mb-4">Welcome, {currentUser?.name}!</h2>
              <p className="text-xl mb-6">You have {bookings.filter(b => b.status === 'upcoming').length} upcoming bookings</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all"
              >
                Browse Catalog
              </button>
            </div>

            {collectiveBookings.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Users className="text-purple-500" size={36} />
                    Cost-Sharing Opportunities
                  </h3>
                  <p className="text-gray-600 mt-2">Join nearby farmers and save up to 70%!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {collectiveBookings.map((collective) => (
                    <div key={collective.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300 hover:shadow-2xl transition-all relative">
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 rounded-bl-2xl font-bold text-lg">
                        Save ₹{collective.savings}
                      </div>

                      <div className="mt-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{collective.machinery}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin size={14} />
                          <span>{collective.location} • {collective.distance}km</span>
                        </div>

                        <div className="bg-white rounded-xl p-4 mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Solo Price</span>
                            <span className="text-lg text-gray-400 line-through">₹{collective.originalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold">Shared Price</span>
                            <span className="text-3xl font-bold text-green-600">₹{collective.sharedPrice}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold">{collective.currentMembers}/{collective.requiredMembers} Farmers</span>
                            <span className="text-purple-600 font-bold">{collective.timeLeft}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                              style={{ width: `${(collective.currentMembers / collective.requiredMembers) * 100}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCollective(collective);
                            setShowCollectiveModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                        >
                          <Users size={20} />
                          Join Group
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Package, title: 'Total Bookings', value: currentUser?.totalBookings || 0, color: 'from-blue-400 to-blue-600' },
                { icon: CheckCircle, title: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'from-green-400 to-green-600' },
                { icon: Clock, title: 'Upcoming', value: bookings.filter(b => b.status === 'upcoming').length, color: 'from-orange-400 to-orange-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl w-fit mb-4`}>
                    <stat.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Machinery Catalog</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Tractor">Tractors</option>
                <option value="Harvester">Harvesters</option>
                <option value="Cultivator">Cultivators</option>
                <option value="Sprayer">Sprayers</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="nearby">Nearby Only</option>
              </select>
            </div>

            {locationFilter === 'nearby' && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Search Radius</span>
                  <span className="text-lg font-bold text-blue-600">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMachinery.map((machine) => (
                <div key={machine.id} className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-100 hover:shadow-2xl transition-all relative">
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <MapPin size={12} />
                    {machine.distance} km
                  </div>

                  <div className="text-6xl mb-4">{machine.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{machine.name}</h3>

                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="font-semibold">{machine.location}</span>
                    </div>
                    <div className="text-xs text-gray-600 ml-5">{machine.address}</div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div><span className="font-semibold">Type:</span> {machine.type}</div>
                    <div><span className="font-semibold">Power:</span> {machine.power}</div>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="font-semibold">{machine.rating}</span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-green-600 mb-4">₹{machine.price}/day</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRentClick(machine)}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
                    >
                      Rent Now
                    </button>
                    <button className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Zap className="text-yellow-500" size={36} />
              AI-Powered Recommendations
            </h2>
            <p className="text-gray-600 mb-8">Get personalized machinery suggestions based on your crop and farm size</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Size (acres)</label>
                <input
                  type="number"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="Enter farm size"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={getMachineryRecommendations}
              disabled={!selectedCrop || !farmSize}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={24} />
              Get AI Recommendations
            </button>

            {showRecommendations && recommendations.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Zap className="text-yellow-500" />
                    Top Recommendations for You
                  </h3>
                  <div className="bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-blue-600">AI Match Score</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 mb-4">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Sparkles className="text-blue-600" size={18} />
                    <span className="font-semibold">
                      Showing results sorted by relevance, rating, proximity, and demand
                    </span>
                  </div>
                </div>

                {recommendations.map((machine, i) => (
                  <div key={machine.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{machine.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{machine.name}</h4>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            #{i + 1} Best Match
                          </span>
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <MapPin size={12} />
                            {machine.distance} km
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{machine.type} • {machine.power}</p>

                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 bg-white rounded-lg p-2 border border-gray-200">
                          <MapPin size={14} className="text-blue-500" />
                          <span className="font-semibold">{machine.location}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{machine.address}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Dynamic Price</div>
                            <div className="text-2xl font-bold text-green-600">₹{machine.dynamicPrice}</div>
                            <div className="text-xs text-gray-500">per day</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">AI Match Score</div>
                            <div className="text-2xl font-bold text-blue-600">{Math.round(machine.score)}%</div>
                            <div className="text-xs text-gray-500">compatibility</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">User Rating</div>
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-400 fill-yellow-400" size={20} />
                              <span className="text-2xl font-bold text-gray-800">{machine.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <div className="flex items-start gap-2">
                            <Sparkles className="text-yellow-600 mt-1" size={18} />
                            <div className="text-sm">
                              <span className="font-bold text-gray-800">Why recommended: </span>
                              <span className="text-gray-700">
                                Perfect for {selectedCrop}, suitable for {farmSize} acres,
                                {machine.distance <= 50 ? ' nearby location' : ' available'},
                                {machine.demand === 'high' ? ' high demand (book early)' : ' good availability'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleRentClick(machine)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          Book Now
                        </button>
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                          <Phone size={18} />
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-purple-600 mt-1" size={24} />
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">How AI Recommendations Work:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Analyzes crop type compatibility with machinery capabilities</li>
                        <li>• Considers your farm size for optimal equipment selection</li>
                        <li>• Factors in proximity to reduce transportation costs</li>
                        <li>• Reviews user ratings and reliability scores</li>
                        <li>• Adjusts pricing based on demand and farm size</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showRecommendations && recommendations.length === 0 && (
              <div className="mt-8 text-center py-12 bg-gray-50 rounded-2xl">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Suitable Machinery Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find machinery suitable for {selectedCrop} in our current inventory.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
                >
                  Browse All Machinery
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Zap className="text-red-500" size={36} />
              AI Crop Disease Scanner
            </h2>
            <p className="text-gray-600 mb-8">Upload an image of a crop leaf to detect potential diseases.</p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Crop Image</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, WEBP</p>

                {diseaseImage && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Image Preview:</h4>
                    <img src={diseaseImage} alt="Crop preview" className="rounded-xl shadow-md mx-auto max-h-60" />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 size={24} />
                    Analysis Results
                  </h3>
                  {diseaseDetection && !isAnalyzing && (
                    <button
                      onClick={() => {
                        setDiseaseImage(null);
                        setDiseaseDetection(null);
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all flex items-center gap-1"
                    >
                      <RefreshCw size={14} />
                      Reset
                    </button>
                  )}
                </div>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-600 font-semibold">Analyzing image...</p>
                  </div>
                ) : diseaseDetection ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border-2 border-red-200">
                      <div className="text-sm text-gray-500">Detected Disease</div>
                      <div className="text-2xl font-bold text-red-600">{diseaseDetection.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border">
                        <div className="text-sm text-gray-500">Confidence</div>
                        <div className="text-2xl font-bold text-gray-800">{diseaseDetection.confidence}%</div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border">
                        <div className="text-sm text-gray-500">Severity</div>
                        <div className={`text-2xl font-bold ${
                          diseaseDetection.severity === 'High' ? 'text-red-500' :
                          diseaseDetection.severity === 'Medium' ? 'text-orange-500' : 'text-green-500'
                        }`}>{diseaseDetection.severity}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border">
                      <div className="text-sm text-gray-500">Recommended Treatment</div>
                      <div className="font-semibold text-gray-800 mt-1">{diseaseDetection.treatment}</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                      <h4 className="font-bold text-gray-800 mb-2">Recommended Equipment:</h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {diseaseDetection.recommendedEquipment.map(equip => (
                          <li key={equip}>{equip}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                      >
                        Find Sprayers Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-16">
                    <p>Upload an image to start the analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weather' && weatherData && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-4xl">🌦️</span>
              Weather Forecast
            </h2>

            <div className="grid md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 border-2 transition-all ${
                    day.ideal
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-sm font-semibold text-gray-600 mb-1">{day.day}</div>
                    <div className="text-5xl mb-2">{day.icon}</div>
                    <div className="text-xl font-bold text-gray-800">{day.temp}°C</div>
                  </div>
                  <div className="text-center text-sm text-gray-700 mb-2">{day.condition}</div>
                  <div className="text-center text-xs text-blue-600 font-semibold mb-2">
                    💧 {day.rainfall}% rain
                  </div>
                  {day.alert && (
                    <div className="mt-2 p-2 bg-red-100 rounded-lg text-xs text-red-700 font-semibold text-center">
                      ⚠️ {day.alert}
                    </div>
                  )}
                  {day.ideal && (
                    <div className="mt-2 p-2 bg-green-100 rounded-lg text-xs text-green-700 font-semibold text-center">
                      ✓ Good for work
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && selectedMachinery && (
        <PaymentModal
          machinery={selectedMachinery}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showCollectiveModal && selectedCollective && (
        <CollectiveModal
          collective={selectedCollective}
          machinery={machinery}
          currentUser={currentUser}
          onClose={() => setShowCollectiveModal(false)}
          onJoin={() => {
            const machine = machinery.find(m => m.id === selectedCollective.machineryId);
            if (machine) {
              setSelectedMachinery({...machine, price: selectedCollective.sharedPrice});
              setShowCollectiveModal(false);
              setShowPaymentModal(true);
            }
          }}
        />
      )}
    </div>
  );
};

const PaymentModal = ({ machinery, onClose, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{machinery.image}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{machinery.name}</h3>
              <p className="text-gray-600">{machinery.type} • {machinery.power}</p>
              <div className="text-3xl font-bold text-green-600 mt-2">₹{machinery.price}/day</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Base Price</span>
            <span className="font-semibold">₹{machinery.price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-semibold">₹{Math.round(machinery.price * 0.18)}</span>
          </div>
          <div className="border-t-2 border-gray-200 my-3"></div>
          <div className="flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-green-600">₹{Math.round(machinery.price * 1.18)}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={24} />
              Pay ₹{Math.round(machinery.price * 1.18)}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const CollectiveModal = ({ collective, machinery, currentUser, onClose, onJoin }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Join Cost-Sharing Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{machinery.find(m => m.id === collective.machineryId)?.image}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{collective.machinery}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin size={14} />
                <span>{collective.location} • {collective.distance}km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar size={14} />
                <span>Date: {collective.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Savings</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Regular Price:</span>
              <span className="text-xl text-gray-400 line-through">₹{collective.originalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shared Price:</span>
              <span className="text-xl font-bold text-purple-600">₹{collective.sharedPrice}</span>
            </div>
            <div className="border-t-2 border-green-300 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold">You Save:</span>
                <span className="text-3xl font-bold text-green-600">₹{collective.savings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Group Members</h3>
          <div className="space-y-2">
            {collective.members.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{member}</div>
                  <div className="text-xs text-gray-600">Confirmed</div>
                </div>
                <CheckCircle className="ml-auto text-green-500" size={20} />
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border-2 border-blue-400 border-dashed">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{currentUser?.name} (You)</div>
                <div className="text-xs text-blue-600 font-semibold">Joining now</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onJoin}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Users size={24} />
            Join & Pay ₹{collective.sharedPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ onBack, onLogout, currentUser, bookings }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h2>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="text-purple-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-semibold text-gray-800">{currentUser?.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="text-purple-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Member Since</div>
                  <div className="font-semibold text-gray-800">{currentUser?.memberSince}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Package className="text-purple-500" size={20} />
                <div>
                  <div className="text-xs text-gray-500">Total Bookings</div>
                  <div className="font-semibold text-gray-800">{currentUser?.totalBookings}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h3>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-xl border-2 ${
                    booking.status === 'upcoming'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{booking.machinery}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {booking.duration} days
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'upcoming'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-800">₹{booking.price}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;