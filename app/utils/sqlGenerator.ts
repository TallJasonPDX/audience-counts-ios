// app/utils/sqlGenerator.ts

// Function to generate SQL query for RN audiences
export const generateRNSqlQuery = (filters: any) => {
  const {
    specialties,
    states,
    zip_regions,
    geo_logic,
    experience_filter
  } = filters;

  // Base query with specific fields - removing line breaks for better API compatibility
  const base_fields = `"First Name" as fn, "Last Name" as ln, "Email1" as email, "Telephone" as phone, "City" as ct, "State" as st, "Zip Code" as zip`;

  // Start building the query
  const query_parts: string[] = [];

  // Generate CTEs for each zip region
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    zip_regions.forEach((region: any, i: number) => {
      if (region.zip && region.radius) {
        query_parts.push(`radius_${i} AS (SELECT DISTINCT z.geoid10 as zip_code FROM zip_shp z, (SELECT geom FROM zip_shp WHERE geoid10 = '${region.zip}') as center WHERE ST_DWithin(z.geom, center.geom, ${region.radius} * 1609.34, false))`);
      }
    });
  }

  // Start main query
  let main_query = `SELECT ${base_fields} FROM public.liveramp_rn_feed r WHERE 1=1`;

  // Add specialty conditions (OR between them)
  if (specialties && specialties.length > 0) {
    const specialty_conditions: string[] = [];

    specialties.forEach((specialty: string) => {
      specialty_conditions.push(`"${specialty}" = '1'`);
    });

    if (specialty_conditions.length > 0) {
      main_query += ` AND (${specialty_conditions.join(' OR ')})`;
    }
  }

  // Geographic conditions
  const geo_conditions: string[] = [];

  // States condition
  if (states && states.length > 0) {
    geo_conditions.push(`"State" IN (${states.map(state => `'${state}'`).join(',')})`);
  }

  // Zip code regions
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    const zip_conditions: string[] = [];

    zip_regions.forEach((region: any, i: number) => {
      if (region.zip && region.radius) {
        zip_conditions.push(`r."Zip Code" IN (SELECT zip_code FROM radius_${i})`);
      }
    });

    if (zip_conditions.length > 0) {
      geo_conditions.push(`(${zip_conditions.join(' OR ')})`);
    }
  }

  // Add geographic conditions with chosen logic (AND or OR)
  if (geo_conditions.length > 0) {
    main_query += ` AND (${geo_conditions.join(` ${geo_logic} `)})`;
  }

  // Experience filter
  if (experience_filter) {
    const { min_years, max_years, min_months, max_months } = experience_filter;

    if (min_years > 0 || max_years > 0 || min_months > 0 || max_months > 0) {
      const exp_conditions: string[] = [];

      if (min_years > 0) {
        exp_conditions.push(`"Years of Experience" >= ${min_years}`);
      }

      if (max_years > 0) {
        exp_conditions.push(`"Years of Experience" <= ${max_years}`);
      }

      if (min_months > 0) {
        exp_conditions.push(`"Months of Experience" >= ${min_months}`);
      }

      if (max_months > 0) {
        exp_conditions.push(`"Months of Experience" <= ${max_months}`);
      }

      if (exp_conditions.length > 0) {
        main_query += ` AND (${exp_conditions.join(' AND ')})`;
      }
    }
  }

  // Combine CTEs with main query
  if (query_parts.length > 0) {
    return `WITH ${query_parts.join(',')} ${main_query}`;
  } else {
    return main_query;
  }
};

// Function to generate SQL query for HCP audiences
export const generateHCPSqlQuery = (filters: any) => {
  const {
    specialties,
    states,
    zip_regions,
    geo_logic
  } = filters;

  // Base query with specific fields - without line breaks
  const base_fields = `"First Name" as fn, "Last Name" as ln, "Email1" as email, "Telephone" as phone, "City" as ct, "State" as st, "Zip Code" as zip`;

  // Start building the query
  const query_parts: string[] = [];

  // Generate CTEs for each zip region
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    zip_regions.forEach((region: any, i: number) => {
      if (region.zip && region.radius) {
        query_parts.push(`radius_${i} AS (SELECT DISTINCT z.geoid10 as zip_code FROM zip_shp z, (SELECT geom FROM zip_shp WHERE geoid10 = '${region.zip}') as center WHERE ST_DWithin(z.geom, center.geom, ${region.radius} * 1609.34, false))`);
      }
    });
  }

  // Start main query
  let main_query = `SELECT ${base_fields} FROM public.liveramp_md_feed r WHERE 1=1`;

  // Add specialty conditions (always OR)
  if (specialties && specialties.length > 0) {
    const specialty_conditions: string[] = [];

    specialties.forEach((specialty: string) => {
      specialty_conditions.push(`"${specialty}" = '1'`);
    });

    if (specialty_conditions.length > 0) {
      main_query += ` AND (${specialty_conditions.join(' OR ')})`;
    }
  }

  // Geographic conditions
  const geo_conditions: string[] = [];

  // States condition
  if (states && states.length > 0) {
    geo_conditions.push(`"State" IN (${states.map(state => `'${state}'`).join(',')})`);
  }

  // Zip code regions
  if (zip_regions && zip_regions.some((r: any) => r.zip && r.radius)) {
    const zip_conditions: string[] = [];

    zip_regions.forEach((region: any, i: number) => {
      if (region.zip && region.radius) {
        zip_conditions.push(`r."Zip Code" IN (SELECT zip_code FROM radius_${i})`);
      }
    });

    if (zip_conditions.length > 0) {
      geo_conditions.push(`(${zip_conditions.join(' OR ')})`);
    }
  }

  // Add geographic conditions with chosen logic (AND or OR)
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