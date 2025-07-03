
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, LogOut, CheckCircle, Clock, AlertCircle, MapPin, Calendar, Package, Phone, Mail, User, Trash2 } from 'lucide-react';

const CompanyDashboard = () => {
  const { user, logout, wasteRequests, updateRequestStatus, deleteWasteRequest } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Show all requests for companies
  const availableRequests = wasteRequests;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted');
  };

  const handleCompleteRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'completed');
  };

  const handleDeleteRequest = (requestId: string) => {
    deleteWasteRequest(requestId);
  };

  const handleContactCustomer = (request: any) => {
    // Get customer details from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('wasteApp_users') || '[]');
    const customer = savedUsers.find((u: any) => u.id === request.customerId);
    setSelectedCustomer(customer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Company Portal</h1>
                <p className="text-white/80">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-700">Dashboard Stats</CardTitle>
                <CardDescription>Overview of waste requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Requests</span>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                    {availableRequests.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {availableRequests.filter(r => r.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accepted</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {availableRequests.filter(r => r.status === 'accepted').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {availableRequests.filter(r => r.status === 'completed').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="text-cyan-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Review pending requests</p>
                  <p>• Accept collection jobs</p>
                  <p>• Mark jobs as complete</p>
                  <p>• Contact customers</p>
                  <p>• Delete completed requests</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">All Requests</h2>
            </div>

            {availableRequests.length === 0 ? (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests available</h3>
                  <p className="text-gray-600">There are currently no waste collection requests from customers.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {availableRequests.map((request) => (
                  <Card key={request.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                              {request.wasteType} Waste Collection
                            </h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request.status)}
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span><strong>Quantity:</strong> {request.quantity}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span><strong>Location:</strong> {request.location}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p><strong>Customer:</strong> {request.customerName}</p>
                            </div>
                          </div>

                          {request.description && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {request.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {request.images.length > 0 && (
                        <div className="mb-4">
                          <Separator className="mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {request.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image}
                                alt={`Request image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="flex space-x-3 flex-wrap gap-2">
                        {request.status === 'pending' && (
                          <Button 
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Accept Request
                          </Button>
                        )}
                        
                        {request.status === 'accepted' && (
                          <Button 
                            onClick={() => handleCompleteRequest(request.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              className="border-gray-300"
                              onClick={() => handleContactCustomer(request)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Contact Customer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Customer Contact Information</DialogTitle>
                              <DialogDescription>
                                Contact details for this request
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <User className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{selectedCustomer.name}</p>
                                    <p className="text-sm text-gray-600">Customer Name</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Mail className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{selectedCustomer.email}</p>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Phone className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <MapPin className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">{selectedCustomer.address}</p>
                                    <p className="text-sm text-gray-600">Address</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {request.status === 'completed' && (
                          <Button 
                            onClick={() => handleDeleteRequest(request.id)}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
