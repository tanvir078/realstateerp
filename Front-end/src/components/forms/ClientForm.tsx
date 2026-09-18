import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/Modal";
import { User, Mail, Phone, Building, Check } from "lucide-react";

interface ClientFormData {
  clientName?: string;
  clientType?: "individual" | "corporate";
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  area?: string;
  // Individual fields
  nid?: string;
  dateOfBirth?: Date;
  gender?: string;
  // Corporate fields
  companyName?: string;
  companyRegistration?: string;
  businessType?: string;
  // Common fields
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  notes?: string;
}

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  editData?: ClientFormData;
}

const ClientForm = ({ isOpen, onClose, onSubmit, editData }: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ClientFormData>({
    defaultValues: editData || {
      clientType: "individual",
      city: "dhaka"
    }
  });

  const clientType = watch("clientType");
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (data: ClientFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    { value: "dhaka", label: "Dhaka" },
    { value: "chittagong", label: "Chittagong" },
    { value: "sylhet", label: "Sylhet" },
    { value: "rajshahi", label: "Rajshahi" },
    { value: "khulna", label: "Khulna" },
    { value: "barisal", label: "Barisal" }
  ];

  const businessTypes = [
    { value: "proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "private_limited", label: "Private Limited" },
    { value: "public_limited", label: "Public Limited" },
    { value: "llc", label: "LLC" }
  ];

  const relations = [
    { value: "spouse", label: "Spouse" },
    { value: "parent", label: "Parent" },
    { value: "sibling", label: "Sibling" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" }
  ];

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>
            {editData ? "Edit Client" : "Add New Client"}
          </ModalTitle>
          <ModalDescription>
            {editData ? "Update client information" : "Register a new client in the system"}
          </ModalDescription>
        </ModalHeader>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="py-4">
          <div className="space-y-6 px-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Client Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                      {...register("clientName")}
                      placeholder="Enter client name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Client Type</label>
                  <Select
                    value={clientType}
                    onValueChange={(value) => setValue("clientType", value as "individual" | "corporate")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                      {...register("phone", { 
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: "Enter valid 11-digit phone number"
                        }
                      })}
                      placeholder="0171-234567"
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-danger">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                      {...register("email", { 
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Enter valid email address"
                        }
                      })}
                      placeholder="client@example.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-danger">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Address Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Address</label>
                <Textarea
                  {...register("address")}
                  placeholder="Enter complete address..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">City</label>
                  <Select
                    value={watch("city")}
                    onValueChange={(value) => setValue("city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Area/Thana</label>
                  <Input
                    {...register("area")}
                    placeholder="Enter area/thana"
                  />
                </div>
              </div>
            </div>

            {/* Individual Client Fields */}
            {clientType === "individual" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Individual Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">National ID (NID)</label>
                    <Input
                      {...register("nid", { 
                        pattern: {
                          value: /^\d{10}$|^\d{13}$/,
                          message: "Enter valid 10 or 13-digit NID"
                        }
                      })}
                      placeholder="Enter 10 or 13-digit NID"
                    />
                    {errors.nid && (
                      <p className="text-sm text-danger">{errors.nid.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Date of Birth</label>
                    <Input
                      type="date"
                      {...register("dateOfBirth", { valueAsDate: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Gender</label>
                    <Select
                      value={watch("gender")}
                      onValueChange={(value) => setValue("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Client Fields */}
            {clientType === "corporate" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Corporate Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <Input
                        {...register("companyName")}
                        placeholder="Enter company name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Registration Number</label>
                    <Input
                      {...register("companyRegistration", { 
                        pattern: {
                          value: /^[A-Z0-9\-]+$/,
                          message: "Enter valid registration number"
                        }
                      })}
                      placeholder="Enter registration number"
                    />
                    {errors.companyRegistration && (
                      <p className="text-sm text-danger">{errors.companyRegistration.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Business Type</label>
                    <Select
                      value={watch("businessType")}
                      onValueChange={(value) => setValue("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Contact Person</label>
                  <Input
                    {...register("emergencyContact")}
                    placeholder="Emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Phone Number</label>
                  <Input
                    {...register("emergencyPhone", { 
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Enter valid phone number"
                      }
                    })}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && (
                    <p className="text-sm text-danger">{errors.emergencyPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Relationship</label>
                  <Select
                    value={watch("emergencyRelation")}
                    onValueChange={(value) => setValue("emergencyRelation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relations.map((relation) => (
                        <SelectItem key={relation.value} value={relation.value}>
                          {relation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Additional Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Notes</label>
                <Textarea
                  {...register("notes")}
                  placeholder="Enter any additional notes..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {editData ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {editData ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Update Client
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Add Client
                    </>
                  )}
                </>
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ClientForm;