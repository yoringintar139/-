import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchSchools, getMeals } from './api'

describe('searchSchools', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('returns schools from API', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ schools: [{ school_name: '테스트초등학교', school_code: '001', edu_office_code: 'B10', address: '' }] }),
    } as Response)
    const result = await searchSchools('테스트')
    expect(result).toHaveLength(1)
    expect(result[0].school_name).toBe('테스트초등학교')
  })

  it('throws on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as Response)
    await expect(searchSchools('테스트')).rejects.toThrow()
  })
})

describe('getMeals', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('returns meals from API', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ meals: [{ date: '20240101', menu_items: ['밥', '김치'], calories: '650 Kcal' }] }),
    } as Response)
    const result = await getMeals('B10', '001', '20240101', '20240131')
    expect(result).toHaveLength(1)
  })

  it('throws on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as Response)
    await expect(getMeals('B10', '001', '20240101', '20240131')).rejects.toThrow()
  })
})
