'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { fetchSettingsAction, updateSettingAction } from '../admin-actions';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const heroFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSettingsAction();
      setSettings(result);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (key: string) => {
    setIsSaving(true);
    try {
      const result = await updateSettingAction(key, settings[key]);
      if (result.success) {
        toast.success(`${key} saved successfully`);
      } else {
        toast.error(result.error || 'Failed to save setting');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save setting');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (key: string, file?: File | null) => {
    if (!file) return;
    setIsSaving(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('key', key);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      const payload = await res.json();
      if (!payload?.success) {
        toast.error(payload?.error || 'Upload failed');
        return;
      }

      const imageUrl = payload.data?.imageUrl;
      if (!imageUrl) {
        toast.error('No image URL returned');
        return;
      }

      setSettings((prev) => ({ ...prev, [key]: imageUrl }));
      toast.success('Image uploaded and saved');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsSaving(false);
    }
  };

  const isHeroImageField = (key: string) => key.startsWith('hero_image_');

  const settingFields = [
    {
      key: 'site_name',
      label: 'Site Name',
      description: 'Your website name',
    },
    {
      key: 'site_tagline',
      label: 'Site Tagline',
      description: 'Short description of your site',
    },
    {
      key: 'affiliate_tag',
      label: 'Amazon Affiliate Tag',
      description: 'Your Amazon Associate tag for tracking',
    },
    {
      key: 'hero_title',
      label: 'Homepage Hero Title',
      description: 'Main headline on the homepage',
    },
    {
      key: 'hero_subtitle',
      label: 'Homepage Hero Subtitle',
      description: 'Secondary text on the homepage',
    },
    {
      key: 'hero_image_1',
      label: 'Homepage Hero Image 1',
      description: 'Upload the first hero carousel image',
    },
    {
      key: 'hero_image_2',
      label: 'Homepage Hero Image 2',
      description: 'Upload the second hero carousel image',
    },
    {
      key: 'hero_image_3',
      label: 'Homepage Hero Image 3',
      description: 'Upload the third hero carousel image',
    },
    {
      key: 'products_per_page',
      label: 'Products Per Page',
      description: 'Number of products to display per page',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="panel p-6 sm:p-8">
        <div className="section-kicker mb-3">Configuration</div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">Settings</h1>
        <p className="mt-3 text-sm leading-6 text-on-surface-muted">Configure your site settings.</p>
      </div>

      {settingFields.map((field) => (
        <Card key={field.key} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{field.label}</CardTitle>
          </CardHeader>

          <div className="space-y-4 p-6">
            <p className="text-sm text-on-surface-muted">{field.description}</p>

            <div className="flex flex-col gap-3 lg:flex-row items-center">
              <div className="flex-1">
                {isHeroImageField(field.key) ? (
                  <div className="mt-3">
                    <input
                      ref={(element) => {
                        heroFileInputs.current[field.key] = element;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(field.key, e.target.files?.[0] ?? null)}
                    />

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        disabled={isSaving || isLoading}
                        onClick={() => heroFileInputs.current[field.key]?.click()}
                      >
                        Choose image
                      </Button>
                    </div>

                    {settings[field.key] ? (
                      <div className="mt-3">
                        <p className="text-sm text-on-surface-muted mb-2">Current image</p>
                        <div className="w-48 h-32 overflow-hidden rounded-lg bg-surface-elevated">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={settings[field.key]}
                            alt={field.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-on-surface-muted">No hero image uploaded yet.</p>
                    )}
                  </div>
                ) : (
                  <Input
                    value={settings[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={isLoading}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>

              {!isHeroImageField(field.key) ? (
                <div className="flex gap-2 items-center">
                  <Button
                    variant="primary"
                    onClick={() => handleSave(field.key)}
                    isLoading={isSaving}
                    disabled={isSaving || isLoading}
                  >
                    Save
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ))}

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Affiliate Information</CardTitle>
        </CardHeader>

        <div className="p-6">
          <div className="rounded-2xl border border-[#c4d7ff] bg-[#eef4ff] p-4">
            <p className="text-sm leading-6 text-[#1f3f8a]">
              <strong>Disclosure:</strong> As an Amazon Associate, this site earns from qualifying
              purchases. Your affiliate tag is automatically appended to product links.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
