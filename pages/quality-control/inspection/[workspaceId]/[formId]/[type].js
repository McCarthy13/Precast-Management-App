/**
 * QC Inspection Page
 * 
 * This page allows QC technicians to:
 * - View pieces scheduled for inspection in a workspace/form
 * - Arrange pieces in any order for inspection
 * - Navigate between pieces horizontally (left/right)
 * - Navigate between pages of the same piece drawing vertically (up/down)
 * - Mark inspection points directly on drawings
 * - Approve or reject pieces with real-time status updates
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Box, Heading, Text, Spinner, Flex, Alert, AlertIcon } from '@chakra-ui/react';
import MainLayout from '../../../components/layout/MainLayout';
import PieceInspectionArrangement from '../../../src/modules/quality_control/components/PieceInspectionArrangement';

export default function InspectionPage() {
  const router = useRouter();
  const { workspaceId, formId, type } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate required parameters
    if (router.isReady) {
      if (!workspaceId || !formId || !type) {
        setError('Missing required parameters. Please ensure workspace ID, form ID, and inspection type are provided.');
        setLoading(false);
      } else {
        // Parameters are valid, ready to load
        setLoading(false);
      }
    }
  }, [router.isReady, workspaceId, formId, type]);

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <Flex justify="center" align="center" h="calc(100vh - 100px)">
          <Spinner size="xl" />
        </Flex>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <Box p={8}>
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
          <Text>Please return to the Quality Control dashboard and try again.</Text>
        </Box>
      </MainLayout>
    );
  }

  // Normalize inspection type
  const inspectionType = type === 'pre-pour' ? 'PRE_POUR' : type === 'post-pour' ? 'POST_POUR' : type.toUpperCase();

  return (
    <MainLayout fullWidth>
      <Box h="calc(100vh - 64px)" overflow="hidden">
        <PieceInspectionArrangement 
          workspaceId={workspaceId} 
          formId={formId} 
          inspectionType={inspectionType} 
        />
      </Box>
    </MainLayout>
  );
}

// Server-side authentication check
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}
