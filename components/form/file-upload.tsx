'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export const FileUpload = ({
  name,
  form,
  value,
  hide,
}: {
  name: string;
  form: any;
  value?: string;
  hide?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const uploadImage = async (file: File | undefined) => {
    setLoading(true);
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file, file.name);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // handle the error
      form.setValue(name, data);
      setLoading(false);
    } catch (e: any) {
      // Handle errors here
      // console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <p>Uploading...</p>
        </div>
      ) : (
        <>
          {value ? (
            <div className='mb-4 flex items-center gap-4'>
              <div className='relative w-full rounded-md overflow-hidden'>
                <div className='z-10 absolute top-2 right-2'>
                  <Button
                    type='button'
                    onClick={() => {
                      form.setValue(name, '');
                    }}
                    variant='destructive'
                    size='icon'
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                </div>
                {!hide ? (
                  <img
                    className='w-full rounded-md'
                    alt='Image'
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${value}`}
                    width={0}
                    height={0}
                    sizes='100vw'
                  />
                ) : (
                  <div className='flex items-center'>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${value}`}
                      className='bg-slate-500 text-white px-2 py-2 rounded-md'
                    >
                      View Document
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Input
                type='file'
                name='file'
                onChange={(e) => uploadImage(e.target.files?.[0])}
              />
              <p className='text-xs text-gray-500'>PNG, JPG, PDF (MAX. 5MB)</p>
            </>
          )}
        </>
      )}
    </div>
  );
};
