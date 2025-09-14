'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare, Dna, Stethoscope, Brain, Heart, Shield,
  ChevronRight, Activity, Target, Zap, BarChart3,
  TrendingUp, Microscope, Database, ArrowRight,
  CheckCircle, Star, Users, Globe
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="w-8 h-8 text-indigo-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">GENOME GPT</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-full shadow-2xl">
                  <Brain className="w-16 h-16 text-indigo-600" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              GENOME GPT
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced AI-powered healthcare solutions combining intelligent chatbots with genomic analysis
              for comprehensive medical insights and personalized care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Shield className="w-5 h-5 mr-2" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center text-purple-600">
                <Star className="w-5 h-5 mr-2" />
                <span>FDA Research Grade</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/chatbot"
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Launch AI Chatbot
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
              </Link>

              <Link
                href="/genomics"
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <Dna className="w-6 h-6 mr-3" />
                  Genomic Analysis
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-60 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-indigo-100 rounded-full opacity-60 animate-bounce delay-500"></div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Two Powerful AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right tool for your medical AI needs - from conversational assistance to advanced genomic analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Chatbot Card */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Medical Chatbot</h3>
                <p className="text-gray-600">Intelligent conversational AI with medical knowledge and memory</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <Brain className="w-5 h-5 text-blue-500 mr-3" />
                  <span>Powered by advanced LLM (Groq)</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Database className="w-5 h-5 text-blue-500 mr-3" />
                  <span>Persistent conversation memory</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Activity className="w-5 h-5 text-blue-500 mr-3" />
                  <span>Real-time medical assistance</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-blue-500 mr-3" />
                  <span>HIPAA-compliant architecture</span>
                </div>
              </div>

              <Link
                href="/chatbot"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center group"
              >
                Start Chatting
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Genomics Card */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                  <Dna className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Genomic Analysis Suite</h3>
                <p className="text-gray-600">Advanced cancer prediction and biomarker monitoring</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <Target className="w-5 h-5 text-purple-500 mr-3" />
                  <span>AEGIS Cancer Risk Prediction</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Zap className="w-5 h-5 text-purple-500 mr-3" />
                  <span>BioSyncDEX Biomarker Monitoring</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <BarChart3 className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Real-time data analysis</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Microscope className="w-5 h-5 text-purple-500 mr-3" />
                  <span>ML-powered interventions</span>
                </div>
              </div>

              <Link
                href="/genomics"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center group"
              >
                Analyze Genomics
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-indigo-100">
              Powering medical research and clinical decision support worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            {/* <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-indigo-200">Analyses Performed</div>
            </div> */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-indigo-200">Uptime</div>
            </div>
            {/* <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-indigo-200">Healthcare Partners</div>
            </div> */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-indigo-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Advancing Healthcare Through AI
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Medical AI Platform combines cutting-edge artificial intelligence with medical expertise
                to provide healthcare professionals with powerful tools for patient care, research, and clinical decision support.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intelligent chatbots that understand medical context to advanced genomic analysis systems,
                we are building the future of AI-assisted healthcare.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-green-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Healthcare Teams</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-medium">Global Research</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">Continuous Innovation</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-2xl">
                    <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Patient Care</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-2xl">
                    <Microscope className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Research</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Security</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-2xl">
                    <Brain className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">AI Innovation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Medical Practice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of healthcare professionals using our AI platform to improve patient outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/chatbot"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Try AI Chatbot
            </Link>

            <Link
              href="/genomics"
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <Dna className="w-6 h-6 mr-3" />
              Explore Genomics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Stethoscope className="w-8 h-8 text-indigo-400 mr-3" />
                <span className="text-2xl font-bold">MedAI Platform</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Advanced AI-powered healthcare solutions for modern medical practice.
                Combining intelligence with compassion for better patient outcomes.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <Link href="/chatbot" className="block text-gray-400 hover:text-white transition-colors">
                  AI Chatbot
                </Link>
                <Link href="/genomics" className="block text-gray-400 hover:text-white transition-colors">
                  Genomic Analysis
                </Link>
                <div className="text-gray-400">API Documentation</div>
                <div className="text-gray-400">Security</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <div className="text-gray-400">Help Center</div>
                <div className="text-gray-400">Contact Us</div>
                <div className="text-gray-400">Privacy Policy</div>
                <div className="text-gray-400">Terms of Service</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Medical AI Platform. All rights reserved. For research and educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;