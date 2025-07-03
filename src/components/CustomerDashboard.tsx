import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Recycle, Plus, Upload, LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import NearbyCompanies from './NearbyCompanies';

const CustomerDashboard = () => {
  const { user, logout, addWasteRequest, wasteRequests } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    location: '',
    description: '',
    images: [] as string[]
  });

  const customerRequests = wasteRequests.filter(request => request.customerId === user?.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, event.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.wasteType && formData.quantity && formData.location) {
      addWasteRequest(formData);
      setFormData({
        wasteType: '',
        quantity: '',
        location: '',
        description: '',
        images: []
      });
      setShowForm(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Customer Portal</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-emerald-700">Quick Actions</CardTitle>
                <CardDescription>Manage your waste disposal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Waste Request
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="text-emerald-700">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Requests</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {customerRequests.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {customerRequests.filter(r => r.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {customerRequests.filter(r => r.status === 'completed').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Companies */}
            <NearbyCompanies />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showForm ? (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-emerald-700">New Waste Request</CardTitle>
                  <CardDescription>Fill out the details for your waste disposal request</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wasteType">Waste Type</Label>
                        <Select 
                          value={formData.wasteType} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, wasteType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select waste type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="plastic">Plastic</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                            <SelectItem value="paper">Paper</SelectItem>
                            <SelectItem value="glass">Glass</SelectItem>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="hazardous">Hazardous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input 
                          id="quantity"
                          value={formData.quantity}
                          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                          placeholder="e.g., 5 bags, 10 kg"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Pickup Location</Label>
                      <Input 
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea 
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional details about the waste"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Images (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload images of your waste</p>
                        <Input 
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                          {formData.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      >
                        Submit Request
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Your Requests</h2>
                </div>

                {customerRequests.length === 0 ? (
                  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="text-center py-12">
                      <Recycle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                      <p className="text-gray-600 mb-4">Create your first waste disposal request to get started.</p>
                      <Button 
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Request
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {customerRequests.map((request) => (
                      <Card key={request.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {request.wasteType} Waste
                              </h3>
                              <p className="text-gray-600">Quantity: {request.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request.status)}
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Location:</strong> {request.location}</p>
                            {request.description && (
                              <p><strong>Description:</strong> {request.description}</p>
                            )}
                            <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>

                          {request.images.length > 0 && (
                            <div className="mt-4">
                              <Separator className="mb-3" />
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {request.images.map((image, index) => (
                                  <img 
                                    key={index}
                                    src={image}
                                    alt={`Request image ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
