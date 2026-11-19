import React from 'react';
import { Database, Server, Code, Layers, ArrowRight, CheckCircle2, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

const About = () => {
  const techStack = [
    {
      name: 'MongoDB Atlas',
      role: 'Database Tier',
      icon: Database,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description:
        'NoSQL document-oriented database storing student data in JSON-like BSON collections. Managed via Mongoose ODM for schema validation, indexing, and CRUD methods.',
    },
    {
      name: 'Express.js',
      role: 'Backend Framework',
      icon: Server,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description:
        'Minimal and flexible Node.js web application framework providing a robust set of features for RESTful routing, CORS configuration, request parsing, and error handling.',
    },
    {
      name: 'React.js (Vite)',
      role: 'Frontend Presentation Tier',
      icon: Code,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      description:
        'Component-based client-side library utilizing React Hooks (useState, useEffect, useMemo) and React Router DOM v6 for responsive Single Page Application (SPA) routing.',
    },
    {
      name: 'Node.js',
      role: 'JavaScript Runtime',
      icon: Cpu,
      color: 'text-green-600 bg-green-50 border-green-200',
      description:
        'Asynchronous, event-driven JavaScript engine running backend server code, orchestrating database transactions and RESTful API endpoints.',
    },
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      route: '/api/students',
      purpose: 'Retrieve all students with optional search and filter queries',
      status: '200 OK',
    },
    {
      method: 'GET',
      route: '/api/students/:id',
      purpose: 'Fetch single student document by MongoDB ObjectId',
      status: '200 OK / 404 Not Found',
    },
    {
      method: 'GET',
      route: '/api/students/stats',
      purpose: 'Aggregate student metrics (branch counts, semester counts, totals)',
      status: '200 OK',
    },
    {
      method: 'POST',
      route: '/api/students',
      purpose: 'Register new student (validates required fields & unique enrollment)',
      status: '201 Created / 400 Bad Request',
    },
    {
      method: 'PUT',
      route: '/api/students/:id',
      purpose: 'Update existing student fields by MongoDB ObjectId',
      status: '200 OK / 400 / 404',
    },
    {
      method: 'DELETE',
      route: '/api/students/:id',
      purpose: 'Remove student document permanently from MongoDB',
      status: '200 OK / 404 Not Found',
    },
    {
      method: 'GET',
      route: '/api/health',
      purpose: 'Health check probe for monitoring backend connectivity & uptime',
      status: '200 OK',
    },
  ];

  const vivaQuestions = [
    {
      q: 'What is the role of Mongoose in a MERN stack application?',
      a: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, translates between objects in code and the representation of those objects in MongoDB, and exposes convenient query APIs.',
    },
    {
      q: 'Why is CORS needed and how is it configured in Express?',
      a: 'Cross-Origin Resource Sharing (CORS) is a browser security mechanism that prevents web pages from making requests to a different domain or port than the one that served the web page. In Express, the "cors" middleware allows the React front-end (http://localhost:5173) to securely communicate with the Express API (http://localhost:5000).',
    },
    {
      q: 'How does Axios integrate React with Express REST endpoints?',
      a: 'Axios is a promise-based HTTP client that sends asynchronous GET, POST, PUT, and DELETE requests from React components to the Express server. It supports request/response interceptors, automatic JSON transformation, and error handling.',
    },
    {
      q: 'How are environment variables used for security in MERN?',
      a: 'The "dotenv" package in Node.js loads sensitive variables (such as MONGODB_URI and PORT) from a local .env file into process.env. In Vite, variables prefixed with VITE_ (e.g. VITE_API_BASE_URL) are exposed to client code. The .env file is gitignored to avoid committing sensitive credentials.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
            Experiment No. 8 • Academic Manual
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Integration of React Front-End with Express/MongoDB Back-End
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aim: Build a complete, functional Student Management System by integrating a React.js client with an Express.js REST API server connected to a MongoDB database.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-sky-200">
            <span>Subject: Full Stack Development</span>
            <span>•</span>
            <span>Semester: B.Tech V Semester</span>
            <span>•</span>
            <span>Architecture: Three-Tier Client-Server</span>
          </div>
        </div>
      </div>

      {/* Architecture Flow Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">MERN Stack 3-Tier Architecture</h2>
          <p className="text-sm text-slate-500 mt-1">
            How data flows between the presentation tier, application logic tier, and database tier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Tier 1: Client */}
          <div className="bg-sky-50/60 p-6 rounded-2xl border border-sky-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Client (React + Vite)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides interactive UI forms, tables, and charts. Dispatches HTTP requests using Axios to backend endpoints.
            </p>
            <div className="text-[11px] font-mono bg-white p-2 rounded-lg border border-sky-200 text-sky-800">
              http://localhost:5173
            </div>
          </div>

          {/* Tier 2: API Server */}
          <div className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">API Server (Express & Node)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receives requests, validates payloads, enforces CORS security, and executes business logic via controllers.
            </p>
            <div className="text-[11px] font-mono bg-white p-2 rounded-lg border border-indigo-200 text-indigo-800">
              http://localhost:5000/api
            </div>
          </div>

          {/* Tier 3: Database */}
          <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Database (MongoDB Atlas)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Persists student documents in the <code className="font-mono">students</code> collection using Mongoose ODM schemas.
            </p>
            <div className="text-[11px] font-mono bg-white p-2 rounded-lg border border-emerald-200 text-emerald-800">
              mongodb://.../student_management_db
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Core Technologies Used</h2>
          <p className="text-sm text-slate-500">Breakdown of each technology layer in the project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl border ${tech.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{tech.name}</h3>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {tech.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tech.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REST API Endpoints Specification */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Backend REST API Endpoints</h2>
          <p className="text-sm text-slate-500">
            HTTP methods, resource routes, and status responses implemented in <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">backend/routes/studentRoutes.js</code>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Description / Purpose</th>
                <th className="py-3 px-4 text-right">HTTP Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {apiEndpoints.map((ep) => (
                <tr key={ep.route + ep.method} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                        ep.method === 'GET'
                          ? 'bg-sky-100 text-sky-800'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ep.method === 'PUT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{ep.route}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">{ep.purpose}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{ep.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viva Voce Questions Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Lab Viva Voce Preparation</h2>
            <p className="text-xs text-slate-500">
              Frequently asked questions during B.Tech Full Stack Development practical evaluation.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <span className="text-sky-600 font-mono">Q{idx + 1}.</span> {item.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
