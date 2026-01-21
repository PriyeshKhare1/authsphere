import { useState } from 'react';
import { Star, Heart, Share2, Download, Settings } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/Card';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import Skeleton, { SkeletonCard } from '../components/Skeleton';
import Progress, { CircularProgress } from '../components/Progress';
import Tabs from '../components/Tabs';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../components/Dropdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(65);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text-primary mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our advanced UI component library
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Buttons</h2>
          <Card padding="lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="gradient">Gradient</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button icon={<Download />} iconPosition="left">Download</Button>
                  <Button icon={<Share2 />} iconPosition="right" variant="secondary">Share</Button>
                  <Button icon={<Settings />} variant="outline">Settings</Button>
                  <Button loading>Loading...</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Inputs</h2>
          <Card padding="lg">
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Default Input" 
                placeholder="Enter text..."
              />
              <Input 
                label="Floating Label" 
                floatingLabel
                placeholder="Enter text..."
              />
              <Input 
                label="With Icon" 
                icon={<Star />}
                placeholder="Search..."
              />
              <Input 
                label="Clearable" 
                clearable
                value="Clear me"
                placeholder="Type something..."
              />
              <Input 
                label="With Counter"
                maxLength={50}
                showCounter
                placeholder="Max 50 characters..."
              />
              <Input 
                label="Success State"
                success="Looks good!"
                value="valid@email.com"
              />
              <Input 
                label="Error State"
                error="This field is required"
              />
              <Input 
                label="Filled Variant"
                variant="filled"
                placeholder="Filled style..."
              />
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card hover padding="lg">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>With hover effect</CardDescription>
              </CardHeader>
              <p className="text-gray-600 dark:text-gray-400">
                This card has a hover effect that lifts it slightly.
              </p>
              <CardFooter>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="gradient" padding="lg">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>Beautiful gradient background</CardDescription>
              </CardHeader>
              <p className="text-gray-600 dark:text-gray-400">
                Smooth gradient background for emphasis.
              </p>
            </Card>

            <Card variant="glass" padding="lg">
              <CardHeader>
                <CardTitle className="text-white">Glass Card</CardTitle>
                <CardDescription className="text-white/80">Glassmorphism style</CardDescription>
              </CardHeader>
              <p className="text-white/80">
                Modern glass effect with backdrop blur.
              </p>
            </Card>
          </div>
        </section>

        {/* Avatars & Progress */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Avatars & Progress</h2>
          <Card padding="lg">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Avatars</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar size="xs" fallback="XS" />
                  <Avatar size="sm" fallback="SM" status="online" />
                  <Avatar size="md" fallback="MD" status="away" />
                  <Avatar size="lg" fallback="LG" status="busy" />
                  <Avatar size="xl" fallback="XL" status="offline" />
                  <Avatar size="2xl" fallback="John Doe" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Progress Bars</h3>
                <div className="space-y-4">
                  <Progress value={progress} showLabel label="Overall Progress" />
                  <Progress value={85} variant="success" showLabel />
                  <Progress value={45} variant="warning" showLabel />
                  <Progress value={25} variant="danger" showLabel />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Circular Progress</h3>
                <div className="flex flex-wrap gap-6">
                  <CircularProgress value={75} />
                  <CircularProgress value={90} variant="success" label="Success" />
                  <CircularProgress value={50} variant="warning" label="Warning" size={100} />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Tabs</h2>
          <Card padding="lg">
            <Tabs
              variant="pills"
              tabs={[
                { label: 'Overview', icon: <Star />, content: <div className="p-4">Overview content goes here...</div> },
                { label: 'Features', badge: '12', content: <div className="p-4">Features content goes here...</div> },
                { label: 'Settings', content: <div className="p-4">Settings content goes here...</div> },
              ]}
            />
          </Card>
        </section>

        {/* Loading States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Loading States</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonCard />
            <Card padding="lg">
              <div className="space-y-4">
                <Skeleton variant="title" width="60%" />
                <Skeleton count={3} />
                <div className="flex gap-3 mt-4">
                  <Skeleton variant="avatar" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="40%" />
                    <Skeleton width="60%" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Modal Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Modal</h2>
          <Card padding="lg">
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </Card>
        </section>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Welcome to AuthSphere"
          size="md"
          footer={
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <p className="text-gray-600 dark:text-gray-400">
            This is a beautiful modal with smooth animations and backdrop blur effect.
            It supports different sizes and custom footer content.
          </p>
        </Modal>
      </div>

      <Footer />
    </div>
  );
}
