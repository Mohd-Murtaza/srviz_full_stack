import { useState, useEffect } from 'react';
import { Calculator, Calendar, Users, DollarSign, FileText, Check, Mail, Search, Filter } from 'lucide-react';
import { leadsAPI, eventsAPI, quotesAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const QuoteGeneration = () => {
  const [actionableLeads, setActionableLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [quote, setQuote] = useState(null);
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const event = events.find(e => e._id === selectedEvent);
      const newPackages = event?.packages || [];
      setPackages(newPackages);
      
      // Only clear package if it doesn't belong to the newly selected event
      if (selectedPackage) {
        const packageBelongsToEvent = newPackages.some(pkg => pkg._id === selectedPackage);
        if (!packageBelongsToEvent) {
          setSelectedPackage('');
        }
      }
    } else {
      setPackages([]);
      setSelectedPackage('');
    }
  }, [selectedEvent, events]);

  useEffect(() => {
    // Filter leads based on search term
    if (searchTerm.trim()) {
      const filtered = actionableLeads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(actionableLeads);
    }
  }, [searchTerm, actionableLeads]);

  const fetchData = async () => {
    try {
      const [leadsResponse, eventsResponse] = await Promise.all([
        leadsAPI.getActionable(), // New endpoint for actionable leads only
        eventsAPI.getAll(),
      ]);

      if (leadsResponse.success) {
        setActionableLeads(leadsResponse.data.leads || []);
        setFilteredLeads(leadsResponse.data.leads || []);
      }
      if (eventsResponse.success) {
        setEvents(eventsResponse.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    }
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setQuote(null); // Reset quote when selecting different lead
    
    // Auto-fill form with lead data
    if (lead.event?._id) {
      setSelectedEvent(lead.event._id);
      // Load packages for this event
      const event = events.find(e => e._id === lead.event._id);
      setPackages(event?.packages || []);
      
      // THEN set the package after packages are loaded
      if (lead.package?._id) {
        setSelectedPackage(lead.package._id);
      }
    }
    
    if (lead.numberOfTravellers) {
      setTravelers(lead.numberOfTravellers);
    }
    if (lead.preferredDate) {
      setTravelDate(lead.preferredDate.split('T')[0]);
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
        leadId: selectedLead._id,
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

  const handleSendEmail = async () => {
    if (!quote || !quote._id) {
      toast.error('No quote to send');
      return;
    }

    try {
      setSendingEmail(true);
      const response = await quotesAPI.sendEmail(quote._id);

      if (response.success) {
        toast.success('Email sent successfully to customer!');
        setQuote({ ...quote, emailSent: true });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
      console.error('Error sending email:', error);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleReset = () => {
    setSelectedLead(null);
    setSelectedEvent('');
    setSelectedPackage('');
    setTravelers(1);
    setTravelDate('');
    setQuote(null);
  };

  const selectedPackageData = packages.find(p => p._id === selectedPackage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dark-navy">Generate Quote</h2>
        <p className="text-gray-600 mt-1">Select a lead, generate quote, and send via email</p>
      </div>

      {/* Actionable Leads Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-navy">Actionable Leads (New & Contacted)</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No actionable leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead._id} 
                    className={`hover:bg-gray-50 transition-colors ${selectedLead?._id === lead._id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.event?.name || 'Not specified'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.package?.name || 'Not specified'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        lead.status === 'new' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant={selectedLead?._id === lead._id ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => handleLeadSelect(lead)}
                      >
                        {selectedLead?._id === lead._id ? 'Selected' : 'Select'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleGenerateQuote} className="space-y-6">
              {/* Selected Lead Info */}
              {selectedLead && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">Selected Lead:</p>
                  <p className="text-lg font-bold text-dark-navy">{selectedLead.name}</p>
                  <p className="text-sm text-gray-600">{selectedLead.email}</p>
                </div>
              )}

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
                  disabled={!selectedLead}
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
                    disabled={!selectedLead}
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
                    disabled={!selectedLead}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || !selectedLead}
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

          {/* Generated Quote - Below Form */}
          {quote && quote.pricingBreakdown && (
            <Card className="p-6 mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-navy">Quote Generated Successfully!</h3>
                  <p className="text-sm text-gray-600">Complete price breakdown & ready to send</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Package Base Price */}
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700">Package Base Price (per person)</span>
                  <span className="font-medium">₹{quote.pricingBreakdown.pricePerPerson?.toLocaleString()}</span>
                </div>

                {/* Number of Travelers */}
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700">Number of Travelers</span>
                  <span className="font-medium">× {quote.pricingBreakdown.numberOfTravellers}</span>
                </div>

                {/* Subtotal (Base Price) */}
                <div className="flex justify-between items-center py-2 border-b-2 border-green-300 bg-green-100/50">
                  <span className="text-gray-700 font-semibold">Subtotal (Base)</span>
                  <span className="font-semibold text-lg">₹{quote.pricingBreakdown.basePrice?.toLocaleString()}</span>
                </div>

                {/* Adjustments Header */}
                <div className="pt-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Price Adjustments</p>
                </div>

                {/* Seasonal Adjustment */}
                {quote.pricingBreakdown.adjustments.seasonal.amount !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">Seasonal Adjustment</span>
                      <span className="text-xs text-gray-500">{quote.pricingBreakdown.adjustments.seasonal.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${quote.pricingBreakdown.adjustments.seasonal.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {quote.pricingBreakdown.adjustments.seasonal.amount > 0 ? '+' : ''}₹{Math.abs(quote.pricingBreakdown.adjustments.seasonal.amount).toLocaleString()}
                      </span>
                      <span className={`block text-xs ${quote.pricingBreakdown.adjustments.seasonal.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ({quote.pricingBreakdown.adjustments.seasonal.percentage > 0 ? '+' : ''}{quote.pricingBreakdown.adjustments.seasonal.percentage}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Early Bird Discount */}
                {quote.pricingBreakdown.adjustments.earlyBird.amount !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">Early Bird Discount</span>
                      <span className="text-xs text-gray-500">{quote.pricingBreakdown.adjustments.earlyBird.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">
                        -₹{Math.abs(quote.pricingBreakdown.adjustments.earlyBird.amount).toLocaleString()}
                      </span>
                      <span className="block text-xs text-green-500">
                        ({quote.pricingBreakdown.adjustments.earlyBird.percentage}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Last Minute Surcharge */}
                {quote.pricingBreakdown.adjustments.lastMinute.amount !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">Last Minute Surcharge</span>
                      <span className="text-xs text-gray-500">{quote.pricingBreakdown.adjustments.lastMinute.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-600">
                        +₹{quote.pricingBreakdown.adjustments.lastMinute.amount.toLocaleString()}
                      </span>
                      <span className="block text-xs text-red-500">
                        (+{quote.pricingBreakdown.adjustments.lastMinute.percentage}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Group Discount */}
                {quote.pricingBreakdown.adjustments.group.amount !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">Group Discount</span>
                      <span className="text-xs text-gray-500">{quote.pricingBreakdown.adjustments.group.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">
                        -₹{Math.abs(quote.pricingBreakdown.adjustments.group.amount).toLocaleString()}
                      </span>
                      <span className="block text-xs text-green-500">
                        ({quote.pricingBreakdown.adjustments.group.percentage}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Weekend Surcharge */}
                {quote.pricingBreakdown.adjustments.weekend.amount !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">Weekend Surcharge</span>
                      <span className="text-xs text-gray-500">{quote.pricingBreakdown.adjustments.weekend.reason}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-600">
                        +₹{quote.pricingBreakdown.adjustments.weekend.amount.toLocaleString()}
                      </span>
                      <span className="block text-xs text-red-500">
                        (+{quote.pricingBreakdown.adjustments.weekend.percentage}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* No Adjustments Message */}
                {quote.pricingBreakdown.totalAdjustments === 0 && (
                  <div className="py-2 border-b border-green-200">
                    <span className="text-gray-500 italic text-sm">No adjustments applied</span>
                  </div>
                )}

                {/* Total Adjustments Summary */}
                {quote.pricingBreakdown.totalAdjustments !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b-2 border-green-300 bg-green-100/50">
                    <span className="text-gray-700 font-semibold">Total Adjustments</span>
                    <span className={`font-semibold text-lg ${quote.pricingBreakdown.totalAdjustments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {quote.pricingBreakdown.totalAdjustments > 0 ? '+' : ''}₹{Math.abs(quote.pricingBreakdown.totalAdjustments).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Final Price */}
                <div className="flex justify-between items-center pt-4 mt-2 border-t-4 border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
                  <span className="text-xl font-bold text-dark-navy">Final Total Price</span>
                  <span className="text-3xl font-bold text-primary-red">
                    ₹{quote.pricingBreakdown.finalPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Quote Metadata */}
                <div className="pt-4 border-t border-green-200 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Quote ID:</span>
                    <span className="font-mono">{quote._id?.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Valid Until:</span>
                    <span>{quote.quote?.validUntil ? new Date(quote.quote.validUntil).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Lead Status:</span>
                    <span className="font-medium capitalize">{quote.leadStatus?.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Send Email Button */}
                <div className="pt-4 border-t border-green-200">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSendEmail}
                    disabled={sendingEmail || quote.quote?.emailSent}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {quote.quote?.emailSent 
                      ? 'Email Sent ✓' 
                      : sendingEmail 
                        ? 'Sending...' 
                        : 'Send Email to Customer'
                    }
                  </Button>
                  {quote.quote?.emailSent && (
                    <p className="text-xs text-green-700 mt-2 text-center">
                      ✓ Email sent successfully! Customer can accept/decline from email.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Selected Info */}
          {(selectedLead || selectedPackageData) && (
            <Card className="p-6">
              <h3 className="font-semibold text-dark-navy mb-4">Selected Info</h3>
              <div className="space-y-3 text-sm">
                {selectedLead && (
                  <div>
                    <p className="text-gray-600">Lead</p>
                    <p className="font-medium text-dark-navy">{selectedLead.name}</p>
                    <p className="text-gray-500">{selectedLead.email}</p>
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
