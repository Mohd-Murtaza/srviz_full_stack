import Modal from '../ui/Modal';
import LeadForm from './LeadForm';

const LeadModal = ({ isOpen, onClose, events, selectedEvent = null, selectedPackage = null }) => {
  const handleSuccess = (data) => {
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan Your Sports Trip" maxWidth="max-w-3xl">
      <div className="mb-4">
        <p className="text-gray-600">
          Fill out the form below and our travel experts will contact you within 24 hours to 
          create your perfect sports travel package.
        </p>
      </div>
      <LeadForm 
        events={events} 
        selectedEvent={selectedEvent} 
        selectedPackage={selectedPackage}
        onSuccess={handleSuccess} 
      />
    </Modal>
  );
};

export default LeadModal;
