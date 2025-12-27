import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const BlockedAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error bg-opacity-10 flex items-center justify-center">
            <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>

          <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
            Account Restricted
          </h2>
          
          <p className="text-text-secondary mb-6">
            Your account has been temporarily restricted due to violations of our community guidelines or terms of service.
          </p>

          <div className="bg-off-white rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-text-primary mb-2">
              While your account is restricted, you cannot:
            </p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• Post new listings</li>
              <li>• Edit existing listings</li>
              <li>• Add items to wishlist</li>
              <li>• Contact sellers</li>
              <li>• Make purchases</li>
            </ul>
          </div>

          <div className="bg-error bg-opacity-10 rounded-lg p-4 mb-6 text-left border border-error">
            <p className="text-sm text-error">
              <strong>Need help?</strong> If you believe this is a mistake or want to appeal this decision, please contact our support team at <a href="mailto:support@unithrift.com" className="underline">support@unithrift.com</a>
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
            <a
              href="mailto:support@unithrift.com"
              className="block text-sm text-sage hover:text-green-dark transition-colors duration-card"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-xs text-text-muted mt-6">
          Please review our <a href="/terms" className="text-sage hover:text-green-dark">Terms of Service</a> and <a href="/community-guidelines" className="text-sage hover:text-green-dark">Community Guidelines</a>
        </p>
      </div>
    </div>
  );
};

export default BlockedAccount;