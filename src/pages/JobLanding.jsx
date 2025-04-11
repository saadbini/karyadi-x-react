import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/jobs/Hero';
import CompanyLogos from '../components/jobs/CompanyLogos';
import Stats from '../components/jobs/Stats';
import Opportunities from '../components/jobs/Opportunities';
import TopJobListings from '../components/jobs/TopJobListings';
import { jobPostAPI } from '../utils/api';

function JobLanding() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeCompanies: 0,
    jobsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await jobPostAPI.getAllJobPosts();
        const jobs = response.data;
        
        // Get featured/latest jobs
        const featured = jobs
          .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
          .slice(0, 3);
        setFeaturedJobs(featured);

        // Calculate stats
        const uniqueCompanies = new Set(jobs.map(job => job.organization_id)).size;
        const thisMonth = jobs.filter(job => {
          const jobDate = new Date(job.created_on);
          const now = new Date();
          return jobDate.getMonth() === now.getMonth() && 
                 jobDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          totalJobs: jobs.length,
          activeCompanies: uniqueCompanies,
          jobsThisMonth: thisMonth
        });
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Hero />
        <CompanyLogos />
        <div className="text-center mb-16">
          <Link to="/jobs">
            <button className="bg-[#00d4c8] text-white px-8 py-4 rounded-lg hover:bg-[#00bfb3] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-semibold">
              Explore Opportunities
            </button>
          </Link>
        </div>
        <Stats stats={stats} loading={loading} />
        <Opportunities />
        <TopJobListings jobs={featuredJobs} loading={loading} />
      </div>
    </div>
  );
}

export default JobLanding;