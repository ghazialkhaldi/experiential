import React from 'react';
import GradientELogo from '../components/GradientELogo';

const LogoDemo = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Gradient E Logo Demo
        </h1>
        
        <div className="space-y-12">
          {/* Different Sizes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Different Sizes</h2>
            <div className="flex items-end justify-center space-x-8 bg-gray-50 p-8 rounded-lg">
              <div className="text-center">
                <GradientELogo size="sm" />
                <p className="text-sm text-gray-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <GradientELogo size="md" />
                <p className="text-sm text-gray-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <GradientELogo size="lg" />
                <p className="text-sm text-gray-600 mt-2">Large</p>
              </div>
              <div className="text-center">
                <GradientELogo size="xl" />
                <p className="text-sm text-gray-600 mt-2">Extra Large</p>
              </div>
            </div>
          </section>

          {/* On Different Backgrounds */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">On Different Backgrounds</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-lg text-center">
                <GradientELogo size="lg" />
                <p className="text-sm text-gray-600 mt-4">White Background</p>
              </div>
              <div className="bg-gray-900 p-8 rounded-lg text-center">
                <GradientELogo size="lg" />
                <p className="text-sm text-gray-300 mt-4">Dark Background</p>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Usage Examples</h2>
            
            {/* Header Example */}
            <div className="bg-white border rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">As Header Logo</h3>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded">
                <GradientELogo size="sm" />
                <span className="text-xl font-semibold text-gray-900">xperiential</span>
              </div>
            </div>

            {/* Icon Example */}
            <div className="bg-white border rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">As App Icon</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center">
                  <GradientELogo size="sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Experiential</p>
                  <p className="text-sm text-gray-600">Volunteer Platform</p>
                </div>
              </div>
            </div>

            {/* Loading Screen Example */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Loading Screen</h3>
              <div className="bg-gray-50 p-12 rounded text-center">
                <div className="animate-pulse">
                  <GradientELogo size="xl" />
                </div>
                <p className="text-gray-600 mt-4">Loading...</p>
              </div>
            </div>
          </section>

          {/* Color Variations */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Alternative Gradient Variations</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-sans">E</span>
                <p className="text-sm text-gray-600 mt-2">Blue to Purple</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <span className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent font-sans">E</span>
                <p className="text-sm text-gray-600 mt-2">Blue-Purple-Indigo</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <span className="text-6xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent font-sans">E</span>
                <p className="text-sm text-gray-600 mt-2">Cyan to Purple</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogoDemo;
