import React, { useState ,useEffect } from 'react';
import { MoreVertical, X } from 'lucide-react';  
import {GetMidiwfeByIdApi} from "@/endpoints/getEndpoints"  
import {AddMidwifeFormData} from "@/types/addMidwifes"

export interface Leads {
  _id: string;
  userId: string;
  midwifeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  insuranceNumber: string;
  insuranceCompany: string;
  insuranceType: string;
  date: string;
  expectedDeliveryDate: string;
  selectedAddressDetails: {
    address :string
  };
  selectedSlot: string;
  status: string;
}

interface LeadsDetailsProps {
  lead: Leads;
}

export const LeadsDetails: React.FC<LeadsDetailsProps> = ({ lead }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);  
  const [midwife , setmidwife] = useState <AddMidwifeFormData>();

  const handleDetailsClick = () => {
    setShowMenu(false);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

//   const formatAddressDetails = (addressObj: object) => {
//     if (!addressObj || typeof addressObj !== 'object') return 'N/A';
//     return JSON.stringify(addressObj, null, 2);
//   };   
useEffect(()=>{
   fectchMidwife();  
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])   

const fectchMidwife = async () =>{
     const response = await GetMidiwfeByIdApi(lead.midwifeId)   
     setmidwife(response.data.data)  
     console.log("Geting midwifes Data::",response.data.data)
} 

  return (
    <div className="relative">
      {/* Three dots menu button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="More options"
      >
        <MoreVertical size={20} className="text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
          <button
            onClick={handleDetailsClick}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            Details
          </button>
        </div>
      )}

      {/* Sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeSidebar}
          ></div>
          
          {/* Sidebar */}
          <div className="w-96 bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Lead Details</h2>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-gray-800">{lead._id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-800">{lead.fullName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-800">{lead.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-800">{lead.phoneNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-800">{lead.userId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Midwife ID</label>
                  <p className="text-gray-800">{lead.midwifeId}</p>
                </div>   
                <div>
                  <label className="text-sm font-medium text-gray-500">Midwife Name</label>
                  <p className="text-gray-800">{midwife?.personalInfo.firstName} {midwife?.personalInfo.lastName}</p>
                </div>  
                <div>
                  <label className="text-sm font-medium text-gray-500">Midwife Email</label>
                  <p className="text-gray-800">{midwife?.personalInfo.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance Number</label>
                  <p className="text-gray-800">{lead.insuranceNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance Company</label>
                  <p className="text-gray-800">{lead.insuranceCompany}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance Type</label>
                  <p className="text-gray-800">{lead.insuranceType}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-800">{lead.date}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Expected Delivery Date</label>
                  <p className="text-gray-800">{lead.expectedDeliveryDate}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Selected Slot</label>
                  <p className="text-gray-800">{lead.selectedSlot}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'active' ? 'bg-green-100 text-green-800' :
                      lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <pre className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                {lead.selectedAddressDetails.address}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};