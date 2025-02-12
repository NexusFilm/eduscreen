import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../src/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { user_id, class_id } = req.query;
        
        let query = supabase.from('documents').select('*');
        
        if (user_id) {
          query = query.eq('user_id', user_id);
        }
        
        if (class_id) {
          query = query.eq('class_id', class_id);
        }

        const { data: documents, error } = await query;

        if (error) throw error;
        return res.status(200).json(documents);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const { user_id, title, content, file_url, file_type, class_ids } = req.body;

        // Create document
        const { data: document, error: docError } = await supabase
          .from('documents')
          .insert([{
            user_id,
            title,
            content,
            file_url,
            file_type
          }])
          .select()
          .single();

        if (docError) throw docError;

        // Associate document with classes if provided
        if (class_ids && class_ids.length > 0) {
          const classDocuments = class_ids.map((class_id: string) => ({
            class_id,
            document_id: document.id
          }));

          const { error: linkError } = await supabase
            .from('class_documents')
            .insert(classDocuments);

          if (linkError) throw linkError;
        }

        return res.status(201).json(document);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updates = req.body;

        // Add updated_at timestamp
        updates.updated_at = new Date().toISOString();

        const { data: document, error } = await supabase
          .from('documents')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(document);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        // Delete document associations first
        await supabase
          .from('class_documents')
          .delete()
          .eq('document_id', id);

        // Delete the document
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Delete associated file from storage if it exists
        const { data: document } = await supabase
          .from('documents')
          .select('file_url')
          .eq('id', id)
          .single();

        if (document?.file_url) {
          const path = document.file_url.split('/').pop();
          if (path) {
            await supabase.storage
              .from('documents')
              .remove([path]);
          }
        }

        return res.status(200).json({ message: 'Document deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 