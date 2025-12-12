import { useState, useEffect } from 'react';
import { Calculator, Calendar, Users, DollarSign, FileText, Check } from 'lucide-react';
import { leadsAPI, eventsAPI, quotesAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const QuoteGeneration = () => {
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const event = events.find(e => e._id === selectedEvent);
      setPackages(event?.packages || []);
      console.log('Packages for selected event:', event?.packages || []);
      setSelectedPackage('');
    }
  }, [selectedEvent, events]);

  const fetchData = async () => {
    try {
      const [leadsResponse, eventsResponse] = await Promise.all([
        leadsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data);
      }
      if (eventsResponse.success) {
        setEvents(eventsResponse.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    }
  };

  const handleGenerateQuote = async (e) => {
    e.preventDefault();
    
    if (!selectedLead || !selectedPackage || !travelers || !travelDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await quotesAPI.generate({
        leadId: selectedLead,
        packageId: selectedPackage,
        travelers: parseInt(travelers),
        travelDate,
      });

      if (response.success) {
        setQuote(response.data);
        toast.success('Quote generated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate quote');
      console.error('Error generating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedLead('');
    setSelectedEvent('');
    setSelectedPackage('');
    setTravelers(1);
    setTravelDate('');
    setQuote(null);
  };

  const selectedLeadData = leads.find(l => l._id === selectedLead);
  const selectedPackageData = packages.find(p => p._id === selectedPackage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dark-navy">Generate Quote</h2>
        <p className="text-gray-600 mt-1">Create personalized quotes for your leads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleGenerateQuote} className="space-y-6">
              {/* Select Lead */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Lead *
                </label>
                <select
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                >
                  <option value="">Choose a lead...</option>
                  {leads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name} - {lead.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event *
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                >
                  <option value="">Choose an event...</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.name} - {event.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Package */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Package *
                </label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                  disabled={!selectedEvent}
                >
                  <option value="">Choose a package...</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name} - ₹{pkg.basePrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  {loading ? 'Generating...' : 'Generate Quote'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Preview & Result */}
        <div className="space-y-6">
          {/* Selected Info */}
          {(selectedLeadData || selectedPackageData) && (
            <Card className="p-6">
              <h3 className="font-semibold text-dark-navy mb-4">Selected Info</h3>
              <div className="space-y-3 text-sm">
                {selectedLeadData && (
                  <div>
                    <p className="text-gray-600">Lead</p>
                    <p className="font-medium text-dark-navy">{selectedLeadData.name}</p>
                    <p className="text-gray-500">{selectedLeadData.email}</p>
                  </div>
                )}
                {selectedPackageData && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Package</p>
                    <p className="font-medium text-dark-navy">{selectedPackageData.name}</p>
                    <p className="text-gray-500">Base: ₹{selectedPackageData.basePrice.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Generated Quote */}
          {quote && (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-navy">Quote Generated!</h3>
                  <p className="text-sm text-gray-600">Ready to send to customer</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Base Price */}
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700">Base Price</span>
                  <span className="font-medium">₹{quote.basePrice?.toLocaleString()}</span>
                </div>

                {/* Adjustments */}
                {quote.adjustments && (
                  <>
                    {quote.adjustments.seasonal !== 1 && (
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Seasonal Adjustment</span>
                        <span className={`font-medium ${quote.adjustments.seasonal > 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {quote.adjustments.seasonal > 1 ? '+' : ''}{((quote.adjustments.seasonal - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {quote.adjustments.earlyBird > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Early Bird Discount</span>
                        <span className="font-medium text-green-600">-{quote.adjustments.earlyBird}%</span>
                      </div>
                    )}
                    {quote.adjustments.lastMinute > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Last Minute Surcharge</span>
                        <span className="font-medium text-red-600">+{quote.adjustments.lastMinute}%</span>
                      </div>
                    )}
                    {quote.adjustments.group > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Group Discount</span>
                        <span className="font-medium text-green-600">-{quote.adjustments.group}%</span>
                      </div>
                    )}
                    {quote.adjustments.weekend > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Weekend Surcharge</span>
                        <span className="font-medium text-red-600">+{quote.adjustments.weekend}%</span>
                      </div>
                    )}
                  </>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-green-300">
                  <span className="text-lg font-bold text-dark-navy">Final Price</span>
                  <span className="text-2xl font-bold text-primary-red">
                    ₹{quote.finalPrice?.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                  For {quote.travelers} traveler{quote.travelers > 1 ? 's' : ''}
                </p>
              </div>
            </Card>
          )}

          {/* Pricing Rules Info */}
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-dark-navy mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Pricing Rules
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>• Seasonal: +20% peak, -15% off-season</li>
              <li>• Early Bird: -10% (60+ days)</li>
              <li>• Last Minute: +15% (&lt;14 days)</li>
              <li>• Group: -5% (5+), -10% (10+)</li>
              <li>• Weekend: +10% (Fri-Sun)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneration;
