import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Server, Database, Globe, Cpu, Cloud, Network } from 'lucide-react';

const ArchitectureReports = () => {
  const [expandedPlatform, setExpandedPlatform] = useState('uber');

  const platforms = {
    uber: {
      name: 'Uber',
      icon: <Network className="w-6 h-6" />,
      color: 'bg-black',
      report: {
        title: 'Uber: Real-Time Ride-Sharing Platform Architecture',
        intro: 'Uber operates one of the world\'s largest real-time dispatch systems, connecting millions of riders with drivers across 10,000+ cities globally. The platform processes billions of requests daily with sub-second latency requirements.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Microservices Foundation',
              content: 'Uber migrated from a monolithic architecture to a microservices-based system with over 2,200 microservices. Key services include: Dispatch Service (matches riders with drivers using predictive algorithms), Trip Management Service (handles trip lifecycle), Payment Service (processes global payments), Mapping Service (routing and ETA calculations), and Surge Pricing Service (dynamic pricing based on supply-demand).'
            },
            {
              name: 'Dispatch System (DISCO)',
              content: 'The dispatch system uses sophisticated algorithms combining geospatial indexing with machine learning. It evaluates driver location, traffic patterns, ride acceptance probability, and predicted trip profitability. The system processes matching in milliseconds using distributed computing across multiple data centers.'
            },
            {
              name: 'Data Infrastructure',
              content: 'Uber utilizes Apache Kafka for real-time event streaming (handling 1+ trillion messages daily), Apache Hadoop and HDFS for batch processing and analytics, Apache Flink for stream processing, and Cassandra/MySQL databases for persistence. The real-time data pipeline enables features like live location tracking and dynamic ETAs.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: Go, Java, Python, Node.js',
            'Mobile: Swift (iOS), Kotlin (Android), React Native',
            'Databases: PostgreSQL, MySQL, Cassandra, Redis',
            'Message Queues: Apache Kafka, RabbitMQ',
            'Infrastructure: AWS, Google Cloud, proprietary data centers',
            'ML/AI: TensorFlow, PyTorch for demand forecasting and fraud detection'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Geographic Distribution: Multi-region deployment with edge computing for reduced latency',
            'Scalability: Horizontal scaling with auto-scaling groups handling demand spikes',
            'Real-time Requirements: WebSocket connections for live updates, optimized with connection pooling',
            'Data Consistency: Eventual consistency model with conflict resolution strategies',
            'Fault Tolerance: Circuit breakers, retry mechanisms, and graceful degradation'
          ]
        },
        conclusion: 'Uber\'s architecture exemplifies modern distributed systems design, prioritizing low latency, high availability, and horizontal scalability. The platform continues evolving with innovations in real-time machine learning and edge computing to maintain competitive advantages in the ride-sharing market.'
      }
    },
    netflix: {
      name: 'Netflix',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-red-600',
      report: {
        title: 'Netflix: Global Streaming Platform Architecture',
        intro: 'Netflix serves over 260 million subscribers across 190+ countries, streaming billions of hours of content monthly. The platform handles massive scale with 99.99% uptime, adapting streaming quality to varying network conditions seamlessly.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Cloud-Native Design',
              content: 'Netflix pioneered cloud-native architecture on AWS, completely abandoning data centers by 2016. The platform uses thousands of microservices deployed across multiple AWS regions. Services include: Content Delivery (serves video streams), Recommendation Engine (personalized suggestions), User Management (authentication and profiles), Playback Service (adaptive streaming logic), and Billing Service (subscription management).'
            },
            {
              name: 'Content Delivery Network (Open Connect)',
              content: 'Netflix built Open Connect, a custom CDN with servers placed inside ISP networks globally. Content is pre-positioned on these edge servers during off-peak hours. When users stream, content is delivered from the nearest Open Connect Appliance (OCA), reducing bandwidth costs and improving streaming quality. The system handles 15+ petabytes of data transfer daily.'
            },
            {
              name: 'Chaos Engineering',
              content: 'Netflix developed Chaos Engineering principles and tools like Chaos Monkey to test system resilience. Services are designed to fail gracefully, with automatic fallback mechanisms. The Simian Army suite randomly terminates instances, services, and even entire data centers to ensure the system remains operational under failure conditions.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: Java with Spring Boot, Node.js',
            'Frontend: React.js for web, native apps for mobile/TV',
            'Databases: Apache Cassandra (primary), MySQL, DynamoDB',
            'Cache: EVCache (Memcached-based), Redis',
            'Message Queue: Apache Kafka for event streaming',
            'Video Processing: FFmpeg, proprietary encoding pipelines',
            'ML Platform: TensorFlow, PyTorch for recommendations'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Adaptive Streaming: Dynamic bitrate adjustment using algorithms that predict network conditions',
            'Personalization at Scale: Processing billions of events daily to generate real-time recommendations',
            'Global Distribution: Multi-region active-active deployment with intelligent routing',
            'Cost Optimization: Efficient video encoding (saving 50% bandwidth with per-title encoding)',
            'Testing at Scale: Comprehensive A/B testing framework affecting millions of users simultaneously'
          ]
        },
        conclusion: 'Netflix\'s architecture sets industry standards for cloud-native applications and resilient system design. The company\'s investments in Chaos Engineering, microservices, and custom CDN infrastructure enable exceptional user experiences at unprecedented scale while inspiring architectural patterns adopted globally.'
      }
    },
    amazon: {
      name: 'Amazon',
      icon: <Server className="w-6 h-6" />,
      color: 'bg-orange-500',
      report: {
        title: 'Amazon: E-Commerce Giant Architecture',
        intro: 'Amazon operates the world\'s largest e-commerce platform, handling hundreds of millions of products and billions of customer interactions. The infrastructure supports retail operations, marketplace, logistics, AWS, and numerous other services with exceptional reliability.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Service-Oriented Architecture (SOA)',
              content: 'Amazon pioneered SOA in the early 2000s, decomposing its monolith into hundreds of services. Each team owns specific services (e.g., Shopping Cart, Recommendations, Inventory, Pricing). Services communicate via APIs, enabling independent development and deployment. This architecture directly influenced the creation of Amazon Web Services (AWS).'
            },
            {
              name: 'Distributed Data Layer',
              content: 'Amazon uses multiple database technologies: DynamoDB (NoSQL for shopping cart, session management), Aurora and RDS (relational data for transactions), S3 (product images and media), ElastiCache (Redis/Memcached for caching), and Neptune (graph database for product relationships). Data is replicated across multiple availability zones for high availability.'
            },
            {
              name: 'Fulfillment & Logistics System',
              content: 'The warehouse management system coordinates 175+ fulfillment centers globally. Real-time inventory tracking uses IoT sensors and robotics (Kiva systems). The routing algorithm optimizes package journeys across the logistics network. Predictive analytics forecast demand to pre-position inventory closer to customers.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: Java, C++, Python, Ruby',
            'Frontend: JavaScript, React, proprietary frameworks',
            'Databases: DynamoDB, Aurora, RDS, Neptune, S3',
            'Infrastructure: AWS (Amazon\'s own cloud platform)',
            'Message Queues: Amazon SQS, Amazon Kinesis',
            'Search: Elasticsearch for product search',
            'ML/AI: Amazon SageMaker, proprietary recommendation engines'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Peak Traffic Management: Auto-scaling infrastructure handling Prime Day and Black Friday surges',
            'Global Inventory Synchronization: Near real-time inventory updates across 175+ warehouses',
            'Fraud Detection: ML-based systems analyzing millions of transactions for anomalies',
            'Personalization: Real-time recommendation engine processing user behavior across multiple touchpoints',
            'Third-Party Marketplace: Secure integration allowing millions of sellers while maintaining performance'
          ]
        },
        conclusion: 'Amazon\'s architecture demonstrates the evolution from monolith to SOA to cloud-native design. The platform\'s architectural principles—service ownership, API-driven communication, and extreme automation—have influenced modern software engineering practices worldwide and birthed AWS, the leading cloud provider.'
      }
    },
    youtube: {
      name: 'YouTube',
      icon: <Cpu className="w-6 h-6" />,
      color: 'bg-red-500',
      report: {
        title: 'YouTube: Global Video Platform Architecture',
        intro: 'YouTube serves over 2.7 billion monthly active users, with 500+ hours of video uploaded every minute. The platform streams 1 billion hours of video daily across devices worldwide, making it one of the largest content distribution systems ever built.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Video Processing Pipeline',
              content: 'Uploaded videos enter a multi-stage pipeline: transcoding (converting to multiple resolutions: 144p to 8K), codec optimization (VP9, AV1, H.264), thumbnail generation, audio extraction, metadata indexing, and content ID scanning. The pipeline processes videos in parallel across distributed workers, completing most conversions within minutes despite complexity.'
            },
            {
              name: 'Content Delivery Infrastructure',
              content: 'YouTube leverages Google\'s global CDN infrastructure with edge servers in thousands of locations. Video chunks are cached at edge nodes using adaptive bitrate streaming (DASH/HLS protocols). The system intelligently predicts popular content and pre-caches it. Google\'s private fiber network interconnects data centers, reducing public internet dependency.'
            },
            {
              name: 'Recommendation System',
              content: 'The recommendation engine accounts for 70% of watch time. It uses deep neural networks processing signals including: watch history, search queries, video metadata, engagement metrics (likes, comments, shares), and session context. The model updates continuously with online learning, personalizing recommendations for billions of users in real-time.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: C++, Python, Java, Go',
            'Frontend: JavaScript, Polymer (Web Components)',
            'Databases: Bigtable, Spanner, MySQL',
            'Storage: Google Colossus (distributed file system)',
            'Video: FFmpeg, VP9, AV1 codecs',
            'ML: TensorFlow, proprietary deep learning frameworks',
            'Infrastructure: Google Cloud Platform, custom data centers'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Upload Volume: Distributed processing pipeline handling 500+ hours uploaded per minute',
            'Storage Management: Exabyte-scale storage with intelligent tiering (hot/warm/cold)',
            'Low Latency Playback: Edge caching and adaptive streaming ensuring smooth playback globally',
            'Content Moderation: AI-powered systems scanning videos for policy violations at upload and runtime',
            'Monetization: Real-time ad serving integrated with video playback, personalized for each viewer'
          ]
        },
        conclusion: 'YouTube\'s architecture showcases Google\'s engineering excellence in video processing, content delivery, and machine learning at unprecedented scale. The platform continues innovating with 4K/8K streaming, live broadcasting, and AI-powered features while maintaining reliability for billions of users worldwide.'
      }
    },
    facebook: {
      name: 'Facebook (Meta)',
      icon: <Cloud className="w-6 h-6" />,
      color: 'bg-blue-600',
      report: {
        title: 'Facebook: Social Network Platform Architecture',
        intro: 'Facebook (now Meta) connects over 3 billion monthly active users across Facebook, Instagram, WhatsApp, and Messenger. The platform processes trillions of interactions daily, managing one of the world\'s largest social graphs with billions of nodes and trillions of edges.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Social Graph Database',
              content: 'The social graph stores relationships between users, posts, pages, and groups. Facebook built TAO (The Associations and Objects), a distributed graph database optimized for read-heavy workloads. TAO caches graph data in multiple layers (L1: in-process cache, L2: regional cache clusters) and uses leader-follower replication across data centers. Queries traverse the graph efficiently using specialized indexing.'
            },
            {
              name: 'News Feed Ranking',
              content: 'The News Feed aggregates stories from friends, pages, and groups, ranking them by relevance. The ranking algorithm uses machine learning models considering thousands of signals: post recency, engagement probability, relationship strength, content type, and user preferences. The system processes billions of ranking requests per second, personalizing feeds for each user in real-time.'
            },
            {
              name: 'Infrastructure & Storage',
              content: 'Facebook operates massive data centers with custom servers and network architecture. Storage includes: MySQL (sharded for structured data), Memcached (largest deployment globally for caching), Haystack (photo storage optimized for small files), and f4 (cold storage using erasure coding). The infrastructure handles 100+ petabytes of new data monthly.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: Hack (PHP dialect), C++, Python, Java',
            'Frontend: React (developed by Facebook), JavaScript',
            'Databases: MySQL (custom), Cassandra, RocksDB',
            'Cache: Memcached (largest deployment worldwide)',
            'Storage: Haystack, f4, Tectonic (distributed file system)',
            'ML: PyTorch (developed by Facebook), custom frameworks',
            'Infrastructure: Custom servers, Open Compute Project hardware'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Real-time Updates: Push notifications and live updates using long-polling and WebSockets',
            'Privacy & Security: Fine-grained access controls on billions of posts with complex sharing settings',
            'Content Moderation: AI systems scanning billions of posts, images, and videos for policy violations',
            'Global Deployment: Data center strategy balancing data locality requirements with performance',
            'Scale & Performance: Optimizing for billions of concurrent users with sub-second response times'
          ]
        },
        conclusion: 'Facebook\'s architecture exemplifies social networking at planetary scale, pioneering technologies like React, GraphQL, and TAO that have shaped modern web development. The platform\'s emphasis on open-sourcing infrastructure innovations (React, PyTorch, Open Compute) has accelerated industry-wide technological advancement.'
      }
    },
    ebay: {
      name: 'eBay',
      icon: <Database className="w-6 h-6" />,
      color: 'bg-yellow-400',
      report: {
        title: 'eBay: Global Marketplace Platform Architecture',
        intro: 'eBay operates one of the world\'s largest online marketplaces, connecting millions of buyers and sellers across 190 markets. The platform handles over $80 billion in gross merchandise volume annually, with 1.7 billion live listings and complex auction mechanics requiring precise timing and consistency.',
        architecture: {
          title: 'Core Architecture Components',
          sections: [
            {
              name: 'Polyglot Persistence Architecture',
              content: 'eBay embraces polyglot persistence, using the right database for each use case: Oracle (primary transactional database for listings and orders), MongoDB (product catalogs and user reviews), Cassandra (user activity streams and analytics), Elasticsearch (product search), and Couchbase (session management and shopping cart). This heterogeneous approach optimizes performance for specific workload patterns.'
            },
            {
              name: 'Search & Discovery Platform',
              content: 'eBay\'s search engine indexes billions of items, handling complex queries with filters (price, condition, location, seller rating). The system uses Elasticsearch with custom relevance algorithms incorporating: textual relevance, seller reputation, listing quality, price competitiveness, and personalization signals. Machine learning models re-rank results based on predicted purchase probability. The search infrastructure processes millions of queries per hour with sub-second latency.'
            },
            {
              name: 'Auction & Bidding System',
              content: 'The bidding system ensures atomicity and consistency for auction operations. Proxy bidding allows users to set maximum bids, with the system automatically incrementing as needed. The architecture handles bid submission surges during auction endings using optimistic locking and retry mechanisms. Real-time updates notify bidders of status changes through event streaming.'
            }
          ]
        },
        technology: {
          title: 'Technology Stack',
          items: [
            'Backend: Java, Node.js, Scala, Python',
            'Frontend: JavaScript, React, Vue.js',
            'Databases: Oracle, PostgreSQL, MongoDB, Cassandra',
            'Search: Elasticsearch, Solr',
            'Cache: Redis, Memcached',
            'Message Queues: Apache Kafka, RabbitMQ',
            'Infrastructure: OpenStack private cloud, public cloud hybrid'
          ]
        },
        challenges: {
          title: 'Key Architectural Challenges & Solutions',
          items: [
            'Transaction Integrity: ACID compliance for financial transactions across distributed systems',
            'Global Consistency: Multi-datacenter replication balancing consistency with availability',
            'Fraud Prevention: Real-time analysis of listings and transactions for fraudulent patterns',
            'Personalization: Customized experiences for diverse user segments (collectors, businesses, casual sellers)',
            'Legacy Modernization: Gradual migration from monolithic architecture to microservices while maintaining operations'
          ]
        },
        conclusion: 'eBay\'s architecture demonstrates pragmatic evolution from monolithic systems to modern distributed architectures. The platform\'s polyglot persistence strategy and focus on search relevance enable a thriving marketplace ecosystem. eBay continues modernizing infrastructure while maintaining the trust and reliability that have defined the brand for decades.'
      }
    }
  };

  const Platform = ({ id, data }) => {
    const isExpanded = expandedPlatform === id;
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm">
        <button
          onClick={() => setExpandedPlatform(isExpanded ? null : id)}
          className={`w-full p-4 flex items-center justify-between ${data.color} text-white hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-3">
            {data.icon}
            <span className="font-bold text-xl">{data.name}</span>
          </div>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {isExpanded && (
          <div className="p-6 bg-white">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
                {data.report.title}
              </h1>
              
              {/* Introduction */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed">{data.report.intro}</p>
              </div>
              
              {/* Architecture */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{data.report.architecture.title}</h2>
                {data.report.architecture.sections.map((section, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-1">{section.name}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                  </div>
                ))}
              </div>
              
              {/* Technology Stack */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{data.report.technology.title}</h2>
                <ul className="space-y-1">
                  {data.report.technology.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
              
              {/* Challenges */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{data.report.challenges.title}</h2>
                <ul className="space-y-1">
                  {data.report.challenges.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
              
              {/* Conclusion */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Conclusion</h2>
                <p className="text-gray-700 leading-relaxed">{data.report.conclusion}</p>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <p className="text-xs text-gray-500 text-center">
                  Architecture Report - {data.name} Platform | 2025
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Major Tech Platform Architectures
          </h1>
          <p className="text-gray-600">
            Comprehensive architecture reports for leading technology platforms
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click on any platform below to view its detailed architecture report
          </p>
        </div>
        
        <div className="space-y-4">
          {Object.entries(platforms).map(([id, data]) => (
            <Platform key={id} id={id} data={data} />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These reports provide high-level architectural overviews based on publicly available information, 
            engineering blogs, and industry knowledge. Actual implementations may include additional proprietary components and optimizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureReports;