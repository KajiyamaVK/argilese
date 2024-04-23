import * as mysql from 'mysql2/promise'

type City = { nome: string; id: number }

export function getCityByUf(uf: string): Promise<City[] | any> {
  return fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.map((city: City) => ({ name: city.nome, id: city.id }))
    })
    .catch((error) => {
      console.error(error)
      return { error: 'Error fetching data: ' + error }
    })
}

async function createTables(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS stdStates (
      id VARCHAR(2) PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS stdCities (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      state_id VARCHAR(2),
      FOREIGN KEY (state_id) REFERENCES stdStates(id)
    );
  `)
}

async function main() {
  const ufs = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ]
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'argilese',
    port: 3306,
  })

  await createTables(connection)

  const statesWithCities = await Promise.all(ufs.map((uf) => getCityByUf(uf).then((cities) => ({ uf, cities }))))

  for (const { uf, cities } of statesWithCities) {
    // Insert or ignore state
    await connection.execute(`INSERT IGNORE INTO stdStates (id, name) VALUES (?, ?)`, [uf, uf]) // Simplifying the state name for this example

    // Insert cities
    for (const city of cities) {
      await connection.execute(`INSERT INTO stdCities (id, name, state_id) VALUES (?, ?, ?)`, [city.id, city.name, uf])
    }
  }
}

main()
