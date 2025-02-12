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
        const { user_id } = req.query;
        if (!user_id) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const { data: classes, error } = await supabase
          .from('classes')
          .select(`
            *,
            widgets (*)
          `)
          .eq('user_id', user_id);

        if (error) throw error;
        return res.status(200).json(classes);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const { name, theme, user_id, widgets } = req.body;

        // Create class
        const { data: newClass, error: classError } = await supabase
          .from('classes')
          .insert([{ name, theme, user_id }])
          .select()
          .single();

        if (classError) throw classError;

        // Add widgets if provided
        if (widgets && widgets.length > 0) {
          const widgetsWithClassId = widgets.map((widget: any) => ({
            ...widget,
            class_id: newClass.id
          }));

          const { error: widgetsError } = await supabase
            .from('widgets')
            .insert(widgetsWithClassId);

          if (widgetsError) throw widgetsError;
        }

        return res.status(201).json(newClass);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updates = req.body;

        const { data, error } = await supabase
          .from('classes')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        // Delete associated widgets first
        await supabase
          .from('widgets')
          .delete()
          .eq('class_id', id);

        // Delete the class
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ message: 'Class deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 