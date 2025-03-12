
// Utility function to generate SQL queries based on audience filters

export const generateRNSqlQuery = (filters: any) => {
  const {
    specialties,
    states,
    zip_regions,
    geo_logic,
    experience_filter
  } = filters;

  // Experience filter values (default to 0 if not provided)
  const min_years = experience_filter?.min_years || 0;
  const min_months = experience_filter?.min_months || 0;
  const max_years = experience_filter?.max_years || 0;
  const max_months = experience_filter?.max_months || 0;

  // Base query with specific fields
  const base_fields = `
    "First Name" as fn,
    "Last Name" as ln,
    "Email1" as email,
    "Telephone" as phone,
    "City" as ct,
    "State" as st,
    "Zip Code" as zip
  `;

  // Start building the query
  const query_parts: string[] = [];

  // Generate CTEs for each zip region
  if (zip_regions && zip_regions.some(r => r.zip && r.radius)) {
    zip_regions.forEach((region, i) => {
      if (region.zip && region.radius) {
        query_parts.push(`
        radius_${i} AS (
          SELECT DISTINCT z.geoid10 as zip_code
          FROM zip_shp z,
              (SELECT geom FROM zip_shp WHERE geoid10 = '${region.zip}') as center
          WHERE ST_DWithin(z.geom, center.geom, ${region.radius} * 1609.34, false)
        )`);
      }
    });
  }

  // Start main query
  let main_query = `SELECT ${base_fields} FROM public.liveramp_rn_feed r WHERE 1=1`;
}

// Function to generate SQL query for HCP audiences
export const generateHCPSqlQuery = (filters: any) => {
  const {
    specialties,
    states,
    zip_regions,
    geo_logic
  } = filters;

  // Base query with specific fields
  const base_fields = `
    "First Name" as fn,
    "Last Name" as ln,
    "Email1" as email,
    "Telephone" as phone,
    "City" as ct,
    "State" as st,
    "Zip Code" as zip
  `;

  // Start building the query
  const query_parts: string[] = [];

  // Generate CTEs for each zip region
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    zip_regions.forEach((region: any, i: number) => {
      if (region.zip && region.radius) {
        query_parts.push(`
        radius_${i} AS (
          SELECT DISTINCT z.geoid10 as zip_code
          FROM zip_shp z,
              (SELECT geom FROM zip_shp WHERE geoid10 = '${region.zip}') as center
          WHERE ST_DWithin(z.geom, center.geom, ${region.radius} * 1609.34, false)
        )`);
      }
    });
  }

  // Start main query
  let main_query = `SELECT ${base_fields} FROM public.liveramp_md_feed r WHERE 1=1`;

  // Add specialty conditions (always AND)
  if (specialties && specialties.length > 0) {
    const specialty_conditions: string[] = [];
    
    specialties.forEach((specialty: string) => {
      // Note: In a real implementation, you would need to call or import
      // the equivalent of the load_hcp_specialties() function to get taxonomies
      // For now, we'll assume the specialties are passed directly with taxonomy codes
      specialty_conditions.push(`"${specialty}" = '1'`);
    });
    
    if (specialty_conditions.length > 0) {
      main_query += ` AND (${specialty_conditions.join(' OR ')})`;
    }
  }

  // Geographic conditions
  const geo_conditions: string[] = [];

  // State condition
  if (states && states.length > 0) {
    const state_list = states.map((s: string) => `'${s.trim()}'`).filter(Boolean);
    if (state_list.length > 0) {
      geo_conditions.push(`"State" IN (${state_list.join(',')})`);
    }
  }

  // Zip code regions condition using CTEs
  const zip_conditions: string[] = [];
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    for (let i = 0; i < zip_regions.filter((r: any) => r.zip && r.radius).length; i++) {
      zip_conditions.push(`r."Zip Code" IN (SELECT zip_code FROM radius_${i})`);
    }
  }

  if (zip_conditions.length > 0) {
    geo_conditions.push(`(${zip_conditions.join(' OR ')})`);
  }

  // Combine geographic conditions based on selected logic
  if (geo_conditions.length > 0) {
    main_query += ` AND (${geo_conditions.join(` ${geo_logic} `)})`;
  }

  // Combine CTEs with main query
  if (query_parts.length > 0) {
    return `WITH ${query_parts.join(',')} ${main_query}`;
  } else {
    return main_query;
  }
};

  // Add specialty conditions (always AND)
  // Note: In the React Native app, we're dealing directly with specialties and not segment codes
  // The segment_code lookup would need to be done on the backend or we'd need to have a mapping
  if (specialties && specialties.length > 0) {
    const specialty_conditions = specialties.map(specialty => 
      `"${specialty.toUpperCase()}" = '1'`
    );
    
    if (specialty_conditions.length > 0) {
      main_query += ` AND (${specialty_conditions.join(' OR ')})`;
    }
  }

  // Add experience filter conditions
  if (min_years > 0 || min_months > 0) {
    const min_months_total = min_years * 12 + min_months;
    main_query += ` AND "License Date" <= CURRENT_DATE - INTERVAL '${min_months_total} months'`;
  }

  if (max_years > 0 || max_months > 0) {
    const max_months_total = max_years * 12 + max_months;
    main_query += ` AND "License Date" >= CURRENT_DATE - INTERVAL '${max_months_total} months'`;
  }

  // Geographic conditions
  const geo_conditions: string[] = [];

  // State condition
  if (states && states.length > 0) {
    const state_list = states.map(s => `'${s.trim()}'`).filter(s => s !== "''");
    if (state_list.length > 0) {
      geo_conditions.push(`"State" IN (${state_list.join(',')})`);
    }
  }

  // Zip code regions condition using CTEs
  const zip_conditions: string[] = [];
  if (zip_regions && zip_regions.some(r => r.zip && r.radius)) {
    const validRegions = zip_regions.filter(r => r.zip && r.radius);
    for (let i = 0; i < validRegions.length; i++) {
      zip_conditions.push(`r."Zip Code" IN (SELECT zip_code FROM radius_${i})`);
    }
  }

  if (zip_conditions.length > 0) {
    geo_conditions.push(`(${zip_conditions.join(' OR ')})`);
  }

  // Combine geographic conditions based on selected logic
  if (geo_conditions.length > 0) {
    main_query += ` AND (${geo_conditions.join(` ${geo_logic} `)})`;
  }

  // Combine CTEs with main query
  if (query_parts.length > 0) {
    return `WITH ${query_parts.join(',')} ${main_query}`;
  } else {
    return main_query;
  }
};
